"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, MapPin } from "lucide-react";
import Cookies from "js-cookie";
import { User } from "@/_lib/type/cookies";
import { useQuery } from "@tanstack/react-query";
import { Profile } from "@/_lib/api/auth/profile";
import { ProfileUser } from "@/_lib/type/auth/users";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfileComponent() {
  const rawUser = Cookies.get("user");
  console.log(rawUser);
  const userData: User | null = rawUser ? JSON.parse(rawUser) : null;

  const {
    data: profileData,
    isPending,
    error,
  } = useQuery<ProfileUser>({
    queryKey: ["userProfile"],
    queryFn: Profile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (!userData) return null;

  const [firstName = "", lastName = ""] = userData.name?.split("/") ?? [];
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`;

  return (
    <div className=" max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and information
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-linear-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                  {initials}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {firstName} {lastName}
                  </h2>
                </div>
              </div>
              <Button asChild>
                <Link href="/dashboard/profile/edit">Edit Profile</Link>
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
                <Mail className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">
                    {userData.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">
                    {userData.phone}
                  </p>
                </div>
              </div>

              {isPending ? (
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">State</p>
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              ) : (
                profileData &&
                profileData.user &&
                "state" in profileData.user &&
                profileData.user.state && (
                  <div className="flex items-center gap-4">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">State</p>
                      <p className="font-medium text-foreground">
                        {profileData.user.state}
                      </p>
                    </div>
                  </div>
                )
              )}
            </CardContent>
          </Card>

          {/* BIO */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">
                {firstName} {lastName}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
