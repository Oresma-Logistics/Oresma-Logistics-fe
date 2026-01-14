import { axiosInstance2 } from "@/_lib/axios";
import { MotorcyclesResponse } from "@/_lib/type/motorcycle/motorcycle";

export async function getAllMotorcycles(): Promise<MotorcyclesResponse> {
  const response = await axiosInstance2.get("/admin/motorcycles");
  return response.data;
}
