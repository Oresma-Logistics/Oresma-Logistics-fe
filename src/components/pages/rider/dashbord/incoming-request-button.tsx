"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAssignmentsCount } from "@/_lib/api/rider/assignment";

export function IncomingRequestButton() {
  const { data } = useQuery({
    queryKey: ["assignmentsCount"],
    queryFn: getAssignmentsCount,
    refetchInterval: 5000,
  });

  const count = data?.count ?? 0;

  return (
    <Button className="rounded-full p-6 cursor-pointer relative" asChild>
      <Link href="/rider/dashboard/requests">
        Incoming Request
        <Badge
          variant="secondary"
          className="absolute -top-3 -right-3 min-w-10 h-10 rounded-full p-0 flex items-center justify-center text-2xl font-extrabold bg-primary text-primary-foreground border-2 border-background shadow-lg ring-2 ring-primary/30"
        >
          {count > 99 ? "99+" : count}
        </Badge>
      </Link>
    </Button>
  );
}
