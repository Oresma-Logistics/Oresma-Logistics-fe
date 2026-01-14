import { axiosInstance2 } from "@/_lib/axios";
import { CreateMotorcyclePayload, MotorcycleResponse } from "@/_lib/type/motorcycle/motorcycle";

export async function CreateMotorcycle(
  data: CreateMotorcyclePayload
): Promise<MotorcycleResponse> {
  const response = await axiosInstance2.post("/admin/motorcycles", data);
  return response.data;
}
