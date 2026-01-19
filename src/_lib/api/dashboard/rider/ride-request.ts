import { axiosInstance2 } from "@/_lib/axios";

interface Contact {
  name: string;
  phone: string;
  email: string;
}

interface Location {
  address: string;
  contact: Contact;
}

interface Pricing {
  currency: string;
  total: number;
}

export interface RideRequestProps {
  pickup: Location;
  dropoff: Location;
  vehicleType: string;
  pricing: Pricing;
}

export async function createRideRequest(data: RideRequestProps) {
  const response = await axiosInstance2.post("/ride-requests", data);
  return response.data;
}
export async function getMyRequest() {
  const response = await axiosInstance2.get("/ride-requests/me");
  return response.data;
}
