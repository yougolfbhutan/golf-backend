export interface PaymentAttributes {
  BookingId?: number;
 
  paymentAmount: number;
  paymentDate: Date;
  PaymentMethod: string;
  journalNumber: string;
  referenceNumber: string;
}
