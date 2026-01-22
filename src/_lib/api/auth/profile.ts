import { axiosInstance2 } from "@/_lib/axios";

export async function Profile() {
  const response = await axiosInstance2.get("/auth/profile");
  return response.data;
}

type UpdateProfile = {
  name: string;
  phone: string;
  state?: string;
};

export async function UpdateProfile(data: UpdateProfile) {
  const response = await axiosInstance2.put("/auth/profile", data);
  return response.data;
}
