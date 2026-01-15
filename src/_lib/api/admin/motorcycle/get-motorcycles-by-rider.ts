import { axiosInstance2 } from "@/_lib/axios";
import { MotorcyclesResponse } from "@/_lib/type/motorcycle/motorcycle";

export async function getMotorcyclesByRider(riderId: string): Promise<MotorcyclesResponse> {
  const response = await axiosInstance2.get(`/admin/motorcycles?riderId=${riderId}`);
  return response.data;
}
