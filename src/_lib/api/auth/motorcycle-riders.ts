import { axiosInstance2 } from "@/_lib/axios";
import { MotorcycleRidersResponse } from "@/_lib/type/auth/motorcycle-riders";

export async function getMotorcycleRiders(state?: string): Promise<MotorcycleRidersResponse> {
  const params = new URLSearchParams();
  if (state) {
    params.append("state", state);
  }
  const queryString = params.toString();
  const url = `/auth/riders/motorcycles${queryString ? `?${queryString}` : ""}`;
  const response = await axiosInstance2.get(url);
  return response.data;
}
