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
            src="https://res.cloudinary.com/duyhha3mz/image/upload/v1759716602/db527da01185893706d5f6280b0b2089fff8c5a7_shv1kd.jpg"
            alt="about-us"
            fill
            className="object-cover rounded-tl-[96px] rounded-br-[96px]"
          />
        </div>
        <div className="px-2 flex flex-col md:items-start items-center">
          <div>
            <SubHeader title="About Us" />
          </div>
          <p className="mt-5 text-base text-primaryT max-w-[540px] font-normal md:text-start text-center">
            Chongqing Zeta Supply Chain Co., Ltd. Since 2006, we have been
            deeply involved in the field of Chinese automobile exports,
            authorized by the Chinese government to promote and sell high
            quality vehicles to all over the world.
            <br />
            <br />
            We are currently looking for distribution partners around the world
            to offer them a wide selection of high-quality vehicles with the
            most competitive price. Through in-depth cooperation with major
            brands and dealers, we ensure quality while providing an affordable
            experience.
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
