// lib/private-gym/discount.ts

// Codici sconto validi per clienti Tribù attivi
// Gestiti via env var per cambiarli senza deploy
function getValidCodes(): string[] {
  const codes = process.env.TRIBU_MEMBER_CODES || "TRIBU20";
  return codes.split(",").map((c) => c.trim().toUpperCase());
}

const MEMBER_PRICE = 20; // Prezzo agevolato clienti Tribù
const STANDARD_PRICE = 25; // Prezzo standard

export interface DiscountResult {
  valid: boolean;
  originalPrice: number;
  finalPrice: number;
  discount: number;
  isTribuMember: boolean;
  message: string;
}

export function validateDiscountCode(
  code: string,
  slotPrice: number
): DiscountResult {
  if (!code || code.trim() === "") {
    return {
      valid: false,
      originalPrice: slotPrice,
      finalPrice: slotPrice,
      discount: 0,
      isTribuMember: false,
      message: "",
    };
  }

  const normalizedCode = code.trim().toUpperCase();
  const validCodes = getValidCodes();

  if (validCodes.includes(normalizedCode)) {
    const finalPrice = Math.min(MEMBER_PRICE, slotPrice);
    return {
      valid: true,
      originalPrice: slotPrice,
      finalPrice,
      discount: slotPrice - finalPrice,
      isTribuMember: true,
      message: "Codice cliente Tribù valido! Tariffa agevolata applicata.",
    };
  }

  return {
    valid: false,
    originalPrice: slotPrice,
    finalPrice: slotPrice,
    discount: 0,
    isTribuMember: false,
    message: "Codice non valido.",
  };
}

export { MEMBER_PRICE, STANDARD_PRICE };
