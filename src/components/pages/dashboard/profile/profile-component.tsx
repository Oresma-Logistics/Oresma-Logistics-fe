"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone } from "lucide-react";
import Cookies from "js-cookie";
import { User } from "@/_lib/type/cookies";

export default function ProfileComponent() {
  const rawUser = Cookies.get("user");
  const userData: User | null = rawUser ? JSON.parse(rawUser) : null;

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
