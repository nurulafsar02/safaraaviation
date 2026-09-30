Safara Aviation email setup

Netlify environment variables:
RESEND_API_KEY = re_ja3v3LLQ_94GMeEFKBA8bdR29Zmq2iNWE
ADMIN_EMAIL = safaraaviationltd@gmail.com
FROM_EMAIL = a verified sender in Resend

The API key is server-side only. The website uses:
Reservation Desk → Netlify Function → Resend → admin email

The page does not redirect or refresh. The button shows "Sending..." and then
"Email sent successfully" on success.
