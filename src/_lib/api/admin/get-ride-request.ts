import { axiosInstance2 } from "@/_lib/axios";
import { QueryFunctionContext } from "@tanstack/react-query";

export async function adminGetRideRequests({ queryKey }: QueryFunctionContext) {
  const [_key, filters] = queryKey as [
    string,
    {
      status?: string;
      invoiceSent?: string;
    }
  ];
  const response = await axiosInstance2.get("/ride-requests", {
    params: filters,
  });
  return response.data;
}
// export async function adminGetRideRequestsAssigned() {
//   const response = await axiosInstance2.get("/ride-requests?status=assigned,in-progress,completed");
//   return response.data;
// }

export async function adminGetSingleRideRequest(id: { id: string }) {
  const response = await axiosInstance2.get(`/ride-requests/${id}`);
  return response.data;
}
