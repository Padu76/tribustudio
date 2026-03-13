// lib/private-gym/nuki.ts
import { env, isNukiMockAllowed } from "./config";

type CreateNukiAccessInput = {
  bookingId: string;
  slotStartIso: string;
  slotEndIso: string;
  fullName: string;
  email: string;
};

export async function createNukiAccess(input: CreateNukiAccessInput) {
  if (!env.NUKI_API_TOKEN || !env.NUKI_SMARTLOCK_ID) {
    if (isNukiMockAllowed) {
      return {
        provider: "mock",
        externalId: `mock-${input.bookingId}`,
        accessInstruction: "Invito Nuki mock creato. In produzione sostituisci con creazione autorizzazione reale via API.",
      };
    }
    throw new Error("Configurazione Nuki incompleta.");
  }

  const response = await fetch(`${env.NUKI_API_BASE_URL}/smartlock/${env.NUKI_SMARTLOCK_ID}/auth`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.NUKI_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `Tribu ${input.fullName}`,
      email: input.email,
      allowedFromDate: input.slotStartIso,
      allowedUntilDate: input.slotEndIso,
      type: 0,
      remoteAllowed: true,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    if (isNukiMockAllowed) {
      return {
        provider: "mock-fallback",
        externalId: `mock-fallback-${input.bookingId}`,
        accessInstruction: `Errore Nuki reale, usato fallback mock. Dettaglio: ${text}`,
      };
    }
    throw new Error(`Errore Nuki: ${text}`);
  }

  const data = await response.json();

  return {
    provider: "nuki",
    externalId: String(data.id ?? data.authId ?? input.bookingId),
    accessInstruction: "Accesso Nuki creato. L'utente riceverà invito/accesso sul proprio smartphone.",
    raw: data,
  };
}
