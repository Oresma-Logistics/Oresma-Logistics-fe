"use client";

import { Button } from "@/components/ui/button";
import { Users, ThumbsUp, Package } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;

    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress === 1) {
        clearInterval(timer);
        setHasAnimated(true);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration, hasAnimated]);

  return count;
}

export function HeroSection() {
  const driversCount = useCountUp(200);
  const satisfactionCount = useCountUp(100);
  const jobsCount = useCountUp(1000);

  return (
    <section id="home" className="relative pt-20 max-lg:pb-15">
      {/* Hero Image with Overlay */}
      <div className="relative h-[500px] md:h-[600px] ">
        <Image
          src="https://res.cloudinary.com/duyhha3mz/image/upload/v1760891284/Hero_nwpufp.jpg"
          alt="Oresma Logistics"
          fill
          priority
          className="w-full h-full object-cover animate-zoom-in"
        />

        {/* Orange accent bar */}
        <div className="absolute bottom-0 left-0 w-32 h-2 bg-primary animate-slide-in-left" />

        {/* Content Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/50 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="max-w-2xl animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-balance max-md:text-center">
                Oresma Logistics
              </h1>
              <p
                className="text-base md:text-lg text-white/90 mb-8 leading-relaxed animate-fade-in-up max-md:text-center"
                style={{ animationDelay: "0.2s" }}
              >
                Your trusted partner in Chinese automobile exports since 2006.
                We offer high-quality vehicles with the most competitive prices,
                connecting global distribution partners with premium automotive
                solutions.
              </p>
              <div className="flex max-md:justify-center">
                <Button
                  className="bg-[#F75720] hover:bg-[#F75720]/90 text-primary-foreground hover:scale-105 transition-transform duration-300 animate-fade-in-up animate-pulse-subtle rounded-tl-3xl rounded-br-3xl"
                  style={{ animationDelay: "0.4s" }}
                  asChild
                >
                  <Link href={"/auth/login"}> GET STARTED</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div
          className="absolute sm:-bottom-8 -bottom-10 right-2 md:right-12 lg:right-24 bg-navy text-navy-foreground rounded-2xl p-6 md:p-8 shadow-2xl max-w-lg animate-fade-in-up hover:scale-105 transition-transform duration-300 bg-primaryT rounded-tl-[120px] rounded-br-[120px]"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="grid grid-cols-3 sm:gap-6 gap-4 md:gap-8 text-white">
            <div className="text-center group">
              <Users className="sm:w-8 sm:h-8 w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl md:text-3xl font-bold">
                {driversCount}+
              </div>
              <div className="text-xs text-navy-foreground/80 mt-1">
                Dedicated Drivers
              </div>
            </div>
            <div className="text-center group">
              <ThumbsUp className="sm:w-8 sm:h-8 w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl md:text-3xl font-bold">
                {satisfactionCount}%
              </div>
              <div className="text-xs text-navy-foreground/80 mt-1">
                Customer Satisfaction
              </div>
            </div>
            <div className="text-center group">
              <Package className="sm:w-8 sm:h-8 w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl md:text-3xl font-bold">
                {jobsCount >= 1000 ? "1k+" : `${jobsCount}+`}
              </div>
              <div className="text-xs text-navy-foreground/80 mt-1">
                Completed Jobs
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
