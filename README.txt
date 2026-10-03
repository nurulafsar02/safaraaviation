Safara Aviation setup

Netlify environment variables (Site settings > Environment variables):
RESEND_API_KEY = your Resend key (server-side only; never write it in this file or index.html)
ADMIN_EMAIL    = where reservation/manager emails go
FROM_EMAIL     = a verified sender in Resend

Mixamo files: put them in the "models" folder next to index.html, all .fbx:
reservation.fbx, customer.fbx, accounts.fbx, manager1.fbx, manager2.fbx (all done, characters "With Skin"); Reservation Desk 2 also uses reservation.fbx
Optional animations ("Without Skin"): walk.fbx for a walking customer
Any file that is missing falls back to the built-in character.

Functions: netlify/functions/send-email.js (existing).

PC setup: each desk has a monitor (facing the staff, animated screen), keyboard, mouse + pad, PC tower and phone. On load, the code plays the typing animation once, finds where each person's fingertips rest, then sets the chair height and puts the keyboard and mouse exactly under the hands (no manual tuning).
