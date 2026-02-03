import { axiosInstance2 } from "@/_lib/axios";

// type Status = {
//   status:
//     | "pending"
//     | "payment_failed"
//     | "payment_success"
//     | "assigned"
//     | "in-progress"
//     | "completed"
//     | "cancelled";
// };

export async function getAssignmentRide() {
  const response = await axiosInstance2.get("/ride-requests/assignments");
  return response.data;
}

export async function getAvalialeRequest() {
  const response = await axiosInstance2.get("/ride-requests/payment-success");
  return response.data;
}

export async function AcceptAssignmentRequest(id: string) {
  const response = await axiosInstance2.patch(`/ride-requests/${id}/status`, {
    status: "assigned",
  });
  return response.data;
}

export async function SingleRiderRequest(id: string) {
  const response = await axiosInstance2.get(`/ride-requests/${id}`);
  return response.data;
}

export async function DeclineAssignmentRequest(id: string) {
  const response = await axiosInstance2.patch(`/ride-requests/${id}/status`, {
    status: "payment_success",
  });
  return response.data;
}
export async function StartAssignmentRequest(id: string) {
  const response = await axiosInstance2.patch(`/ride-requests/${id}/status`, {
    status: "in-progress",
  });
  return response.data;
}
export async function FinishAssignmentRequest(id: string, secretCode: string) {
  const response = await axiosInstance2.patch(`/ride-requests/${id}/status`, {
    status: "completed",
    secretCode: secretCode,
  });
  return response.data;
}
