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
    };

export async function createRideRequest(data: RideRequestProps) {
  const response = await axiosInstance2.post("/ride-requests", data);
  return response.data;
}
export async function getMyRequest() {
  const response = await axiosInstance2.get("/ride-requests/me");
  return response.data;
}
