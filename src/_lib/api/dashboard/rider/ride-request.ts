import { axiosInstance2 } from "@/_lib/axios";

interface Contact {
  name: string;
  phone: string;
  email: string;
}

interface Location {
  address: string;
  contact?: Contact; // Made optional for backward compatibility with truck routes
}

interface Pricing {
  currency: string;
  total: number;
}

// Union type to support both legacy (truck) and new (shipment details) formats
export type RideRequestProps =
  | {
      // New format with contact and pricing (for shipment details)
      pickup: {
        address: string;
        contact: Contact;
      };
      dropoff: {
        address: string;
        contact: Contact;
      };
      vehicleType: string;
      pricing: Pricing;
      riderId?: string; // Optional rider ID for assignment
    }
  | {
      // Legacy format without contact and pricing (for truck routes)
      pickup: {
        address: string;
      };
      dropoff: {
        address: string;
      };
      vehicleType: string;
      riderId?: string; // Optional rider ID for assignment
    };

export async function createRideRequest(data: RideRequestProps) {
  const response = await axiosInstance2.post("/ride-requests", data);
  return response.data;
}
export async function getMyRequest() {
  const response = await axiosInstance2.get("/ride-requests/me");
  return response.data;
}

interface InvoiceResponse {
  success: boolean;
  message: string;
  transaction: {
    reference: string;
    type: string;
    title: string;
    description: string;
    userId: string;
    rideRequestId: string;
    amount: number;
    currency: string;
    status: string;
    provider: string;
    channel: string;
    metadata: {
      source: string;
      rideRequestId: string;
      rideRequestReference: string;
      userId: string;
      transactionReference: string;
    };
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  authorizationUrl: string;
}

export async function updateRideRequestInvoice(
  rideRequestId: string,
  total: number
): Promise<InvoiceResponse> {
  const response = await axiosInstance2.patch(
    `/ride-requests/${rideRequestId}/invoice`,
    { total }
  );
  return response.data;
}

interface ApplyDiscountPayload {
  code: string;
  amount: number;
}

interface DiscountData {
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  discount: {
    _id: string;
    code: string;
    type: string;
    value: number;
    status: string;
    validFrom: string;
    validTo: string;
    currentUses: number;
    applicableVehicleTypes: string[];
    createdBy: {
      _id: string;
      name: string;
      email: string;
      phone: string;
      role: string;
      isEmailVerified: boolean;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    description: string;
    usageHistory: unknown[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

interface ApplyDiscountResponse {
  success: boolean;
  message: string;
  data: DiscountData;
}

export async function applyDiscount(
  payload: ApplyDiscountPayload
): Promise<ApplyDiscountResponse> {
  const response = await axiosInstance2.post("/discounts/apply", payload);
  return response.data;
}
