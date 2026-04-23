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
        <div style="text-align:center;margin-bottom:24px;">
          <h1 style="font-size:28px;margin-bottom:4px;color:#ff6b35;">Prenotazione confermata ✅</h1>
          <p style="color:#666;font-size:14px;">Tribù Private Gym</p>
        </div>
        <p>Ciao <strong>${input.fullName}</strong>,</p>
        <p>la tua prenotazione è stata confermata con successo!</p>
        <div style="background:#f9f9f9;border-radius:12px;padding:20px;margin:20px 0;">
          <p style="margin:0 0 8px 0;"><strong>📅 Slot:</strong> ${input.startsAtLabel}</p>
          <p style="margin:0 0 8px 0;"><strong>🚪 Accesso disponibile da:</strong> ${input.accessFromLabel}</p>
          <p style="margin:0 0 8px 0;"><strong>⏱️ Fine uso attrezzature:</strong> ${input.endTrainingLabel}</p>
          <p style="margin:0;"><strong>🆔 ID prenotazione:</strong> ${input.bookingId}</p>
        </div>
        <div style="background:#fff3e0;border-left:4px solid #ff6b35;padding:16px;border-radius:8px;margin:20px 0;">
          <p style="margin:0 0 8px 0;font-weight:bold;">📋 Regole dello studio:</p>
          <ul style="margin:0;padding-left:20px;">
            <li>Porta un asciugamano personale</li>
            <li>Entra con scarpe pulite o calze</li>
            <li>Lascia tutto in ordine al termine</li>
            <li>Lo studio è videosorvegliato</li>
          </ul>
        </div>
        <p>Per qualsiasi domanda, contattaci su WhatsApp: <a href="https://wa.me/393478881515" style="color:#ff6b35;">+39 347 888 1515</a></p>
        <p>A presto,<br/><strong>Tribù Studio</strong></p>
      </div>
    `,
  });

  return {
    provider: "resend",
    messageId: response.data?.id ?? null,
  };
}

export async function sendSlotRequestApprovedEmail(input: {
  to: string;
  fullName: string;
  dateLabel: string;
  timeLabel: string;
  bookingUrl: string;
}) {
  if (!isEmailEnabled || !env.RESEND_API_KEY || !env.EMAIL_FROM) {
    console.warn("[email] Slot request approval email skipped (email disabled or env missing)");
    return { provider: "disabled", messageId: null };
  }

  const resend = new Resend(env.RESEND_API_KEY);

  try {
    const response = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: [input.to],
      subject: "Richiesta approvata – Tribù Private Gym",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;line-height:1.6;color:#111">
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="font-size:26px;margin-bottom:4px;color:#ff6b35;">Richiesta approvata ✅</h1>
            <p style="color:#666;font-size:14px;">Tribù Private Gym</p>
          </div>
          <p>Ciao <strong>${input.fullName}</strong>,</p>
          <p>la tua richiesta per Private Gym del <strong>${input.dateLabel}</strong> alle <strong>${input.timeLabel}</strong> è stata approvata.</p>
          <p>Per confermare la prenotazione clicca il pulsante qui sotto e completa il pagamento:</p>
          <div style="text-align:center;margin:28px 0;">
            <a href="${input.bookingUrl}" style="display:inline-block;background:#ff6b35;color:#fff;padding:14px 32px;border-radius:999px;text-decoration:none;font-weight:600;">
              Procedi al pagamento
            </a>
          </div>
          <p style="color:#666;font-size:13px;">Oppure copia e incolla questo link nel browser:<br/>
            <span style="word-break:break-all;color:#ff6b35;">${input.bookingUrl}</span>
          </p>
          <p style="color:#999;font-size:12px;margin-top:32px;">Il link è valido 24 ore. Se non completi il pagamento entro questo tempo, lo slot potrebbe essere riassegnato.</p>
          <p>A presto,<br/><strong>Tribù Studio</strong></p>
          <p style="color:#999;font-size:12px;">Per assistenza: <a href="https://wa.me/393478881515" style="color:#ff6b35;">WhatsApp +39 347 888 1515</a></p>
        </div>
      `,
    });

    return {
      provider: "resend",
      messageId: response.data?.id ?? null,
    };
  } catch (err) {
    console.error("[email] sendSlotRequestApprovedEmail failed:", err);
    return { provider: "resend", messageId: null };
  }
}
