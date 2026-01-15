import { axiosInstance2 } from "@/_lib/axios";
import { MotorcycleRidersResponse } from "@/_lib/type/auth/motorcycle-riders";

export async function getMotorcycleRiders(): Promise<MotorcycleRidersResponse> {
  const response = await axiosInstance2.get("/auth/riders/motorcycles");
  return response.data;
}
