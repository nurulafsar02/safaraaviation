exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: { Allow: "POST" }, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const apiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;
    const fromEmail = process.env.FROM_EMAIL;

    if (!apiKey || !adminEmail || !fromEmail) {
      return {
        statusCode: 500,
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({error:"Email service is not configured in Netlify environment variables."})
      };
    }

    const esc = (x) => String(x ?? "")
      .replace(/&/g,"&amp;").replace(/</g,"&lt;")
      .replace(/>/g,"&gt;").replace(/"/g,"&quot;");

    let subject, html;

    if (data.type === "management") {
      if (!data.name || !data.phone || !data.message) {
        return {statusCode:400, headers:{"Content-Type":"application/json"},
          body:JSON.stringify({error:"Please fill name, phone and message."})};
      }
      subject = "Message to Management – Safara Aviation";
      html = `<h2>Message to Management – Safara Aviation</h2>
        <p><b>Name:</b> ${esc(data.name)}</p>
        <p><b>Phone:</b> ${esc(data.phone)}</p>
        <p><b>Message:</b><br>${esc(data.message).replace(/\n/g,"<br>")}</p>`;
    } else {
      const required = ["from","to","departure","name","phone"];
      for (const field of required) {
        if (!String(data[field] || "").trim()) {
          return {statusCode:400, headers:{"Content-Type":"application/json"},
            body:JSON.stringify({error:`Missing field: ${field}`})};
        }
      }
      subject = `Booking Request – ${data.item || "Safara Aviation"}`;
      html = `<h2>New Booking Request – Safara Aviation</h2>
        <table cellpadding="7" cellspacing="0" border="1" style="border-collapse:collapse">
        <tr><td><b>Item</b></td><td>${esc(data.item)}</td></tr>
        <tr><td><b>From</b></td><td>${esc(data.from)}</td></tr>
        <tr><td><b>To</b></td><td>${esc(data.to)}</td></tr>
        <tr><td><b>Departure</b></td><td>${esc(data.departure)}</td></tr>
        <tr><td><b>Return</b></td><td>${esc(data.returnDate)}</td></tr>
        <tr><td><b>Adults</b></td><td>${esc(data.adults)}</td></tr>
        <tr><td><b>Children</b></td><td>${esc(data.children)}</td></tr>
        <tr><td><b>Name</b></td><td>${esc(data.name)}</td></tr>
        <tr><td><b>Phone</b></td><td>${esc(data.phone)}</td></tr>
        <tr><td><b>Notes</b></td><td>${esc(data.notes)}</td></tr>
        </table>`;
    }

    const provider = await fetch("https://api.resend.com/emails", {
      method:"POST",
      headers:{
        "Authorization":`Bearer ${apiKey}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        from:fromEmail,
        to:[adminEmail],
        subject:subject,
        html:html
      })
    });

    const result = await provider.json();
    if (!provider.ok) {
      return {statusCode:provider.status, headers:{"Content-Type":"application/json"},
        body:JSON.stringify({error:result.message || "Email provider rejected the request."})};
    }

    return {statusCode:200, headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ok:true,id:result.id})};
  } catch (error) {
    return {statusCode:500, headers:{"Content-Type":"application/json"},
      body:JSON.stringify({error:"Server error while sending email."})};
  }
};
