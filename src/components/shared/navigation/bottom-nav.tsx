"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/_lib/utils";
import { LayoutDashboard, MapPin, User } from "lucide-react";

export interface BottomNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const defaultItems: BottomNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: "Rides", href: "/dashboard/my-requests", icon: <MapPin className="h-5 w-5" /> },
  { label: "Account", href: "/dashboard/profile", icon: <User className="h-5 w-5" /> },
];

interface BottomNavProps {
  items?: BottomNavItem[];
  className?: string;
}

export function BottomNav({ items = defaultItems, className }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-background py-2 safe-area-pb",
        "lg:hidden",
        className
      )}
    >
      {items.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-4 py-2 text-xs font-medium transition-colors",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
