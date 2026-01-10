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
