"use client";
import { useQuery } from "@tanstack/react-query";
import { getAllTransactions } from "@/_lib/api/transaction/get-transaction";

import { BaseTable } from "@/components/shared/table/table-style";
import { Suspense } from "react";
import { SearchFilter } from "@/components/shared/dashboard/search-fliter";
import SkeletonCardList from "@/components/shared/skeleton/card-list-skeleton";
import { TransactionsResponse } from "@/_lib/type/transaction/transaction";

export function AdminTransactionsTable() {
  const {
    data: withdrawalData,
    isPending,
    error: Error,
    isError,
  } = useQuery<TransactionsResponse>({
    queryKey: ["Transactions"],
    queryFn: getAllTransactions,
  });
  if (isPending) {
    return <SkeletonCardList />;
  }
  if (isError) {
    return <div>Error: {Error?.message}</div>;
  }
  return (
    <div className="space-y-6">
      <Suspense>
        <SearchFilter
          paramName="Transaction Id"
          placeholder="Search by Transaction ID, User ID "
          className="bg-[#FAFBFD] rounded-md shadow-[0px_4px_4px_0px_#00000040] px-4 py-2"
        />
      </Suspense>
      <BaseTable
        columns={[
          { label: "Transaction Id", key: "_id" },
          { label: "Transaction Title", key: "title" },
          { label: " Type", key: "type" },
          { label: " User Email", key: "userId.email" },
          {
            label: "Amount",
            key: "amount",
            render(value, row) {
              return `${row.currency === "NGN" ? "₦" : "$"} ${value}`;
            },
          },

          {
            label: "Status",
            key: "status",
            render: (status: string) => (
              <span
                className={`px-2 py-1 rounded-full text-white text-sm ${
                  status === "paid"
                    ? "bg-green-500"
                    : status === "pending"
                    ? "bg-yellow-500"
                    : status === "failed" || status === "cancelled"
                    ? "bg-red-500"
                    : "bg-gray-500"
                }`}
              >
                {status}
              </span>
            ),
          },
          {
            label: "Created At",
            key: "createdAt",
            render: (value) => {
              return new Date(value).toLocaleString();
            },
          },
          {
            label: "Updated At",
            key: "updatedAt",
            render: (value) => {
              return new Date(value).toLocaleString();
            },
          },
        ]}
        count={withdrawalData.count}
        showCountBadge={true}
        data={withdrawalData.transactions}
      />
    </div>
  );
}
