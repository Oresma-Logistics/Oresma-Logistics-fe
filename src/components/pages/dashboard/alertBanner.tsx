"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAssignmentsCount } from "@/_lib/api/rider/assignment";

export function DashboardBanner() {
  const { data } = useQuery({
    queryKey: ["assignmentsCount"],
    queryFn: getAssignmentsCount,
    refetchInterval: 5000,
  });

  const totalRequests = data?.count ?? 0;

  return (
    <div className="relative rounded-xl overflow-hidden p-6 text-white shadow-[0_4px_4px_0_#00000040] py-6 px-5 min-h-[120px] flex flex-col justify-center">
      <div className="absolute inset-0">
        <Image
          src="/dashboard/AlertBackground.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-lg font-semibold flex items-center gap-2 flex-wrap">
          You have{" "}
          <Button
            asChild
            size="lg"
            className="text-2xl font-bold h-12 min-w-12 px-4 bg-secondaryT hover:bg-orange-600 text-white border-0"
          >
            <Link href="/dashboard/my-requests">{totalRequests}</Link>
          </Button>{" "}
          active ride{totalRequests !== 1 ? "s" : ""}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            className="bg-secondaryT hover:bg-orange-600 text-white"
          >
            <Link href="/dashboard/rider">Book ride</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white text-white hover:bg-white/20 hover:text-white"
          >
            <Link href="/dashboard/my-requests">View rides</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
