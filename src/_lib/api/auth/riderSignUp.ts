import { SignUp } from "@/_lib/type/auth";
import { axiosResponseHandle } from "@/_lib/reponse";
import { axiosAuthInstance } from "@/_lib/axios";

export async function riderSignUp(data: SignUp) {
  const response = await axiosAuthInstance.post("/auth/signup-rider", data);
  return axiosResponseHandle(response);
}

