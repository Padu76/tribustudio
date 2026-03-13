// lib/private-gym/email.ts
import { Resend } from "resend";
import { env, isEmailEnabled } from "./config";

export async function sendBookingEmail(input: {
  to: string;
  fullName: string;
  startsAtLabel: string;
  accessFromLabel: string;
  endTrainingLabel: string;
  bookingId: string;
  accessInstruction: string;
}) {
  if (!isEmailEnabled || !env.RESEND_API_KEY || !env.EMAIL_FROM) {
    return { provider: "disabled", messageId: null };
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const response = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: [input.to],
    subject: "Prenotazione confermata – Tribù Private Gym",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;line-height:1.6;color:#111">
        <h1 style="font-size:28px;margin-bottom:12px;">Prenotazione confermata</h1>
        <p>Ciao ${input.fullName},</p>
        <p>la tua prenotazione Tribù Private Gym è confermata.</p>
        <ul>
          <li><strong>Slot:</strong> ${input.startsAtLabel}</li>
          <li><strong>Accesso disponibile da:</strong> ${input.accessFromLabel}</li>
          <li><strong>Fine uso attrezzature:</strong> ${input.endTrainingLabel}</li>
          <li><strong>ID prenotazione:</strong> ${input.bookingId}</li>
        </ul>
        <p><strong>Accesso smart:</strong><br/>${input.accessInstruction}</p>
        <p>Ricorda di usare asciugamano, entrare con scarpe pulite o calze e lasciare tutto in ordine.</p>
        <p>Lo studio è videosorvegliato.</p>
        <p>A presto,<br/>Tribù Studio</p>
      </div>
    `,
  });

  return {
    provider: "resend",
    messageId: response.data?.id ?? null,
  };
}
