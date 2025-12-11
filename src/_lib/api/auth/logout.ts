"use client";
import { ResponseHandle } from "@/_lib/reponse";
// import { useQueryClient } from "@tanstack/react-query";
export async function logOut() {
  const request = await fetch(`/api/auth/logout`, {
    method: "POST",
    body: null,
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await request.json();
  // const queryClient = useQueryClient();
  // queryClient.clear();
  ResponseHandle(result);
  return result;
}
