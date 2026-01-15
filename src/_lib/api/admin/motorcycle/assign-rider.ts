import { axiosInstance2 } from "@/_lib/axios";

export interface AssignRiderPayload {
  riderId: string;
}

export interface AssignRiderResponse {
  success: boolean;
  message: string;
  motorcycle?: {
    _id: string;
    riderId: string;
    // ... other motorcycle fields
  };
}

export async function assignRiderToMotorcycle(
  motorcycleId: string,
  data: AssignRiderPayload
): Promise<AssignRiderResponse> {
  const response = await axiosInstance2.patch(
    `/admin/motorcycles/${motorcycleId}/rider`,
    data
  );
  return response.data;
}
