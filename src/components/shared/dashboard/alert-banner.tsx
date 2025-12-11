"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";

interface AlertBannerProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction?: () => void;
  onDismiss?: () => void;
  image?: string;
  btnVarinat?: "primary" | "secondary" | "none";
}

const varinat = {
  primary: "bg-secondaryT hover:bg-orange-600 text-white",
  secondary: "bg-primaryT hover:bg-primaryT/80 text-white",
  none: "",
};

export function AlertBanner({
  title,
  description,
  actionLabel,
  onAction,
  onDismiss,
  image = "/dashboard/AlertBackground.jpg",
  btnVarinat = "primary",
}: AlertBannerProps) {
  return (
    <div className="relative rounded-xl  p-6 text-white shadow-[0_4px_4px_0_#00000040] py-6 px-5 ">
      <div className="absolute w-full h-full inset-0 ">
        <Image
          src={image}
          alt="alert banner"
          fill
          className="object-cover rounded-xl object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/40 rounded-xl" />
      </div>
      <div className="z-5 text-white relative">
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute right-4 top-4 text-white/70 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="mb-4 text-sm">{description}</p>
      </div>
      <Button
        onClick={onAction}
        className={` ${varinat[btnVarinat]}   mt-2 z-5 relative`}
      >
        {actionLabel}
      </Button>
    </div>
  );
}
