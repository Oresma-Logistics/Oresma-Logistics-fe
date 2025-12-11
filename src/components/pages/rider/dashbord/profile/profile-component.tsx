"use client";
// import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Mail, MapPin, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getRiderProfile } from "@/_lib/api/rider/rider";
import SkeletonCardList from "@/components/shared/skeleton/card-list-skeleton";
import { RiderProfileResponse } from "@/_lib/type/auth/users";

import { PerformanceRiderProfile } from "./perfomance-profile";
import { RiderProfileStatus } from "./account-status";
import { VehicleRiderProfile } from "./vehicle-profile";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RiderProfileComponent() {
  // const [isEditing] = useState(false);
  const {
    data: riderProfileData,
    isPending,
    error: Error,
  } = useQuery<RiderProfileResponse>({
    queryKey: ["riderProfile"],
    queryFn: getRiderProfile,
    staleTime: 24 * 60 * 60 * 1000, // 5 hours
  });

  if (isPending) {
    return <SkeletonCardList />;
  }

  if (!isPending && Error) {
    return <div className="text-red-500 text-sm">{Error.message}</div>;
  }

  const [firstName = "", lastName = ""] = riderProfileData
    ? riderProfileData.rider.userId.name.split(" ")
    : [];
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`;

  return (
    <div className=" max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground"> Rider Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and information
        </p>
      </div>

      {/* OVERVIEW */}
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-linear-to-br from-primaryT to-primaryT/80 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                {initials}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {firstName} {lastName}
                </h2>
              </div>
            </div>
            <Button asChild>
              <Link href={"/rider/dashboard/profile/edit"}>Edit Profile</Link>
            </Button>
          </CardHeader>
        </Card>

        {/* CONTACT INFO */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-primaryT" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">
                  {riderProfileData.rider.userId.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Phone className="w-5 h-5 text-primaryT" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium text-foreground">
                  {riderProfileData.rider.userId.phone}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="w-5 h-5 text-primaryT" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Current Location
                </p>
                <p className="font-medium text-foreground">
                  {riderProfileData.rider.currentLocation?.coordinates
                    ? `${riderProfileData.rider.currentLocation.coordinates[0].toFixed(
                        4
                      )}, ${riderProfileData.rider.currentLocation.coordinates[1].toFixed(
                        4
                      )}`
                    : "Not available"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BIO */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="text-lg">About</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border">
              <div className="flex flex-row gap-6 justify-center items-center">
                <div className="flex gap-3 items-center flex-row">
                  Rider Verified:{" "}
                  <BooleanStatusBadge
                    status={riderProfileData.rider.isVerified}
                    trueLabel="Yes"
                    falseLabel="No"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}
        <div>
          <PerformanceRiderProfile rider={riderProfileData.rider} />
        </div>
        <div>
          <RiderProfileStatus rider={riderProfileData.rider} />
        </div>
        <div>
          <VehicleRiderProfile rider={riderProfileData.rider} />
        </div>
      </div>
    </div>
  );
}
