import { axiosInstance2 } from "@/_lib/axios";

interface ReassignRiderPayload {
  riderId: string;
}

interface ReassignRiderResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export async function reassignRiderToRequest(
  rideRequestId: string,
  data: ReassignRiderPayload
): Promise<ReassignRiderResponse> {
  const response = await axiosInstance2.patch(
    `/ride-requests/${rideRequestId}/assign`,
    data
  );
  return response.data;
}
