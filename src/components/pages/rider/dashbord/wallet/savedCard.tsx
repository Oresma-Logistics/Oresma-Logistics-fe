"use client";
import { Card } from "@/components/ui/card";
import { Mutation, useQuery } from "@tanstack/react-query";
import { getRiderProfile } from "@/_lib/api/rider/rider";

import SkeletonCard from "@/components/shared/skeleton/single-card-skeleton";
import { RiderProfileResponse } from "@/_lib/type/auth/users";
import { MoreVerticalIcon } from "lucide-react";
import Image from "next/image";
import { maskAccountNumber } from "@/_lib/functions/maskaccount";
import { Landmark } from "lucide-react";

type BankCardProps = {
  bankname: string;
  banknumber: string;
  balance: string;
  bankImage: string;
};

// export function WalletBankCards() {
//   return (
//     <div className="grid md:grid-cols-3 max-w-5xl gap-5">
//       <BankCard />
//     </div>
//   );
// }

export function BankCard() {
  const {
    data: riderProfileData,
    isPending,
    isSuccess,
    error: Error,
  } = useQuery<RiderProfileResponse>({
    queryKey: ["riderProfile"],
    queryFn: getRiderProfile,
  });

  if (isPending) {
    return <SkeletonCard />;
  }

  if (!isPending && Error) {
    return <div className="text-red-500 text-sm">{Error.message}</div>;
  }

  if (!isPending && isSuccess && !riderProfileData.rider.bankDetails) {
    return null;
  }
  return (
    <Card className="px-3 bg-[#F8F9FC] border-none shadow-[0px_4px_4px_0px_#00000040 w-full max-w-2xs">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between flex-row items-center">
          <div>
            <h3 className="font-semibold">
              {riderProfileData.rider.bankDetails.accountName}
            </h3>
            <p className="text-[#AEAFB2] font-semibold">
              {maskAccountNumber(
                riderProfileData.rider.bankDetails.accountNumber
              )}
            </p>
          </div>
          <Landmark size={40} />
        </div>
        <div>
          <div className="flex justify-between flex-row items-center">
            <div>{riderProfileData.rider.bankDetails.bankName}</div>
            <div>
              <MoreVerticalIcon size={20} className="text-black" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
