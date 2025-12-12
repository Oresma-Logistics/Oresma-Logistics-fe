export interface Transaction {
  _id: string;
  reference: string;
  type: string;
  title: string;
  description: string;
  userId: {
    email: string;
    _id: string;
  };
  rideRequestId: string;
  amount: number;
  currency: string;
  status: "paid" | "awaiting_payment" | "pending" | "failed" | "cancelled";
  provider: string;
  channel: string;
  metadata: {
    source: string;
    rideRequestId: string;
    rideRequestReference: string;
    userId: string;
    transactionReference: string;
  };
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
  paymentUrl: string;
  providerReference: string;
  paidAt?: string; // optional, might be missing if not paid yet
}

export interface TransactionsResponse {
  success: boolean;
  message: string;
  count: number;
  transactions: Transaction[];
}
