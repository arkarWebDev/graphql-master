export type BookingRow = {
  id: string;
  roomTitle: string;
  roomId: string;
  startDate: string;
  endDate: string;
  total: number;
  paymentStatus: "paid" | "pending";
  paymentMethod: "card" | "cash";
};
