import { axiosInstance } from "@/_lib/axios";

export async function sendPasswordVerificationCode(email: { email: string }) {
  const request = await axiosInstance.post("/auth/forgot-password", email);

  return request.data;
}

export async function resetPassword(data: {
  code: string;
  newPassword: string;
}) {
  const request = await axiosInstance.post("/auth/reset-password", data);
  return request.data;
}
