"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SubHeader } from "@/components/shared/landingpage/sub-header";
import Link from "next/link";

export default function AboutUs() {
  return (
    <main className="max-w-7xl mx-auto" id="about">
      <div className="w-full px-0 py-2 flex justify-center items-center md:flex-row flex-col gap-8 ">
        <div className="w-[332px] h-[337px] relative">
          <Image
            src="https://res.cloudinary.com/dsmc6vtpt/image/upload/v1766447230/38593081598d640c22f8ca34b6739e11_g0fgeo.jpg"
            alt="about-us"
            fill
            className="object-cover rounded-tl-[96px] rounded-br-[96px]"
          />
        </div>
        <div className="px-2 flex flex-col md:items-start items-center">
          <div>
            <SubHeader title="About Us" />
          </div>
          <p className="mt-5 text-base text-white max-w-[540px] font-normal md:text-start text-center">
            Oresma Logistics. Since 2006, we have been a trusted leader in
            trucking and dispatch delivery services, connecting businesses with
            reliable transportation solutions across the region.
            <br />
            <br />
            We specialize in providing efficient dispatch services and managing
            a professional fleet of trucks to ensure timely and safe deliveries.
            Through our dedicated network of drivers and logistics expertise, we
            ensure quality service while maintaining competitive pricing for all
            your transportation needs.
          </p>
          <Button
            className="bg-[#F75720] hover:bg-[#F75720]/90 text-primary-foreground hover:scale-105 transition-transform duration-300 animate-fade-in-up animate-pulse-subtle rounded-tl-3xl rounded-br-3xl mt-6 text-xs"
            style={{ animationDelay: "0.4s" }}
            asChild
          >
            <Link href={"/auth/login"}> GET STARTED</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
