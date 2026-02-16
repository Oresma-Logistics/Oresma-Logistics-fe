import { axiosInstance2 } from "@/_lib/axios";

export async function getRiderProfile() {
  const response = await axiosInstance2.get("/riders/profile");
  return response.data;
}

export async function updateRiderLocation(latitude: number, longitude: number) {
  const response = await axiosInstance2.patch("/riders/profile", {
    currentLocation: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
  });
  return response.data;
}
