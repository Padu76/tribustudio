// lib/private-gym/paypal.ts
// Legge direttamente da process.env per evitare problemi di caching del modulo config

function getPayPalBaseUrl() {
  const env = process.env.PAYPAL_ENV || "sandbox";
  return env === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("[PayPal] Env check:", {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      paypalEnv: process.env.PAYPAL_ENV,
    });
    throw new Error("PayPal credentials mancanti.");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Impossibile ottenere token PayPal.");
  }

  const data = await response.json();
  return data.access_token as string;
}

export async function createPayPalOrder(amountEur: number, customId: string) {
  const token = await getAccessToken();
  const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: customId,
          amount: {
            currency_code: "EUR",
            value: amountEur.toFixed(2),
          },
        },
      ],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Errore createPayPalOrder: ${text}`);
  }

  return response.json();
}

export async function capturePayPalOrder(orderId: string) {
  const token = await getAccessToken();
  const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Errore capturePayPalOrder: ${text}`);
  }

  return response.json();
}
