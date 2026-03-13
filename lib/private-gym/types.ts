// lib/private-gym/types.ts
export type SlotStatus = "available" | "booked" | "blocked";

export type SlotRecord = {
  id: string;
  starts_at: string;
  ends_at: string;
  access_from_local: string;
  end_training_local: string;
  status: SlotStatus;
  price_eur: number;
  capacity: number;
};

export type BookingCustomerInput = {
  fullName: string;
  email: string;
  phone: string;
  notes?: string;
  acceptedRules: boolean;
};
