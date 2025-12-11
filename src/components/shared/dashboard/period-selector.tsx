"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouterParams } from "@/_lib/functions/params-router-function";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface PeriodOption {
  label: string;
  value: string;
}

interface PeriodSelectorProps {
  options: PeriodOption[];
  paramName?: string;
  defaultValue?: string;
  className?: string;
  icon?: React.ReactNode;
  selectedClassName?: string;
}

export function PeriodSelector({
  options,
  paramName = "period",
  defaultValue,
  className = "",
  selectedClassName = "",
  icon = <Calendar className="h-4 w-4 text-gray-500" />,
}: PeriodSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { clearParams } = useRouterParams();

  const currentPeriod =
    searchParams.get(paramName) || defaultValue || options[0]?.value;

  const handlePeriodChange = (value: string) => {
    if (value === defaultValue) {
      clearParams({ paramName: paramName });
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramName, value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentLabel =
    options.find((opt) => opt.value === currentPeriod)?.label ||
    options[0]?.label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`flex items-center gap-2 bg-white hover:bg-gray-50 ${className}`}
        >
          {icon}
          <span className="text-sm font-medium">{currentLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handlePeriodChange(option.value)}
            className={`cursor-pointer ${
              currentPeriod === option.value
                ? `bg-orange-50 text-secondaryT font-medium ${selectedClassName}`
                : ""
            }`}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
