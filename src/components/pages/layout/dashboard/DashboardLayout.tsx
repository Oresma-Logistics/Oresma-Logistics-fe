"use client";
import { DashboardSidebar } from "@/components/pages/layout/dashboard/AppSideBar";
import { Suspense, useEffect, useState } from "react";
import { cn } from "@/_lib/utils";
import Cookies from "js-cookie";
import { Header } from "@/components/shared/headers/header";
import { User } from "@/_lib/type/cookies";
import { BottomNav } from "@/components/shared/navigation/bottom-nav";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userCookies = Cookies.get("user");
    if (userCookies) {
      setUser(JSON.parse(userCookies));
    }
  }, []);

  // 👇 Prevent hydration mismatch by not rendering until mounted

  return (
    <div className="flex min-h-screen bg-background">
      <Suspense fallback="">
        <DashboardSidebar
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
        <Header
          // title={`hello ${user?.name ?? ""}`}
          title="User Dashboard"
          userImage="/diverse-user-avatars.png"
          userName={user?.name ?? ""}
          // userName="User"
          onToggleSidebar={() => {
            if (window.innerWidth < 1024) {
              setIsMobileSidebarOpen(!isMobileSidebarOpen);
            } else {
              setIsSidebarCollapsed(!isSidebarCollapsed);
            }
          }}
        />
        <div className={cn("p-6", "pb-20 lg:pb-6")}>{children}</div>
        <BottomNav />
      </div>
    </div>
  );
}
