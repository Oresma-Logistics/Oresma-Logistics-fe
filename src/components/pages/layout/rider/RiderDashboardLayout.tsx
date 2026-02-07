"use client";
import RiderSideBar from "./AppSideBar";
import { Suspense, useState, useEffect } from "react";
import { cn } from "@/_lib/utils";
import { Header2 } from "@/components/shared/headers/header";
import { User } from "@/_lib/type/cookies";
import Cookies from "js-cookie";
import { BottomNav } from "@/components/shared/navigation/bottom-nav";
import { LayoutDashboard, MapPin, User as UserIcon } from "lucide-react";
export function RiderDashbboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userCookies = Cookies.get("user");
    if (userCookies) {
      setUser(JSON.parse(userCookies));
    }
  }, []);
  // if (user === null) {
  //   return null; // or show a skeleton loader
  // }
  return (
    <div className="flex min-h-screen bg-background">
      <Suspense>
        <RiderSideBar
          isCollapsed={isSidebarCollapsed}
          onCollapsedChange={setIsSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
      </Suspense>
      <div
        className={cn(
          "flex-1 transition-all duration-300",
          "lg:ml-20",
          "md:overflow-x-hidden",
          !isSidebarCollapsed && "lg:ml-64"
        )}
      >
        <Header2
          title="Driver’s Dashbaord"
          userImage="/diverse-user-avatars.png"
          userName={user?.name}
          onToggleSidebar={() => {
            if (window.innerWidth < 1024) {
              setIsMobileSidebarOpen(!isMobileSidebarOpen);
            } else {
              setIsSidebarCollapsed(!isSidebarCollapsed);
            }
          }}
          bgcolor="#021533"
        />
        <div className={cn("p-6", "pb-20 lg:pb-6")}>{children}</div>
        <BottomNav
          items={[
            {
              label: "Dashboard",
              href: "/rider/dashboard",
              icon: <LayoutDashboard className="h-5 w-5" />,
            },
            {
              label: "Rides",
              href: "/rider/dashboard/requests",
              icon: <MapPin className="h-5 w-5" />,
            },
            {
              label: "Account",
              href: "/rider/dashboard/profile",
              icon: <UserIcon className="h-5 w-5" />,
            },
          ]}
        />
      </div>
    </div>
  );
}
