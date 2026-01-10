import { axiosInstance2 } from "@/_lib/axios";
import { CreateRiderPayload } from "@/_lib/type/auth";

export async function CreateRider(data: CreateRiderPayload) {
  const response = await axiosInstance2.post("/admin/riders", data);
  return response.data;
}
