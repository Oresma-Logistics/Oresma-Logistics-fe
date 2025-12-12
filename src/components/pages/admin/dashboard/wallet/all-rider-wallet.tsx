"use client";
import { BaseTable } from "@/components/shared/table/table-style";
import { useQuery } from "@tanstack/react-query";
import { getAllWallet } from "@/_lib/api/wallet/get-all-wallet";
import { Wallets } from "@/_lib/type/wallets/wallet";
import SkeletonCardList from "@/components/shared/skeleton/card-list-skeleton";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export default function AllRiderWalletPage() {
  const Navigate = useRouter();
  const {
    data: AllWallets,
    isPending,
    isError,
  } = useQuery<Wallets>({
    queryKey: ["all-wallets"],
    queryFn: getAllWallet,
  });

  if (isPending) {
    return <SkeletonCardList />;
  }

  const RowActions = ({ id }: { id: string }) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className="h-5 w-5 cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="px-3 py-2 max-md:ml-6">
          <DropdownMenuItem
            onClick={() => {
              Navigate.push(`/admin/dashboard/wallet/${id}`);
            }}
          >
            View Wallet
          </DropdownMenuItem>
          <DropdownMenuItem>Update Wallet Status</DropdownMenuItem>
          <DropdownMenuItem>Rider Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="space-y-6">
      <h1>All Rider Wallets</h1>

      {!isPending && !isError && AllWallets.wallets && (
        <BaseTable
          columns={[
            { key: "_id", label: "Wallet ID", width: "30%" },
            { key: "userId.email", label: "User Email", width: "30%" },
            {
              key: "balance",
              label: "Balance",
              width: "20%",
              render(value, row) {
                return `${row.currency === "NGN" ? "₦" : "$"} ${value}`;
              },
            },
            { key: "currency", label: "Currency", width: "20%" },
            { key: "status", label: "Status", width: "20%" },
            {
              key: "isPinSet",
              label: "Is Pin Set",
              width: "20%",
              render(value) {
                return (
                  <div
                    className={`w-8 h-5 rounded-full ${
                      value ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                );
              },
            },
            {
              key: "createdAt",
              label: "Created At",
              width: "25%",
              render(value) {
                const date = new Date(value);
                return date.toLocaleDateString();
              },
            },
          ]}
          data={AllWallets.wallets ?? []}
          count={AllWallets.count ? AllWallets.count : 0}
          showCountBadge={true}
          rowActions2={(row) => {
            return (
              <>
                <RowActions id={row._id} />
              </>
            );
          }}
        />
      )}
    </div>
  );
}
