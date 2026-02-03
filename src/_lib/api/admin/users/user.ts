import { axiosInstance2 } from "@/_lib/axios";

export async function getallUser() {
  const response = await axiosInstance2.get("/admin/users");
  return response.data;
}
export async function getallCustomer() {
  const response = await axiosInstance2.get("/admin/users/role/customer");
  return response.data;
}
export async function getallRider() {
  const response = await axiosInstance2.get("/riders");
  return response.data;
}
export async function getallAdmin() {
  const response = await axiosInstance2.get("/admin/users/role/admin");
  return response.data;
}

interface DeleteRiderResponse {
  success: boolean;
  message: string;
}

export async function deleteRider(riderId: string): Promise<DeleteRiderResponse> {
  const response = await axiosInstance2.delete(`/admin/riders/${riderId}`);
  return response.data;
}

interface UpdateUserStatePayload {
  state: string;
}

interface UpdateUserStateResponse {
  success: boolean;
  message: string;
}

export async function updateUserState(
  userId: string,
  payload: UpdateUserStatePayload
): Promise<UpdateUserStateResponse> {
  const response = await axiosInstance2.put(`/admin/users/${userId}`, payload);
  return response.data;
}