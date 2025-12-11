import { axiosInstance2 } from "@/_lib/axios";
import { QueryFunctionContext } from "@tanstack/react-query";

export async function getAllTransactions() {
  const response = await axiosInstance2.get("/transactions");
  return response.data;
}

export async function getWithdrawalRequests({
  queryKey,
}: QueryFunctionContext) {
  const [_key, filters] = queryKey as [
    string,
    {
      status?: string;
    }
  ];
  const response = await axiosInstance2.get(`/transactions?type=payout`, {
    params: filters,
  });
  return response.data;
}
