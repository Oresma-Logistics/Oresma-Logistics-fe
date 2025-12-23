import { CheckCircle2 } from "lucide-react";
import { RiderSignupForm } from "./riderSignupForm";
import Image from "next/image";
import Link from "next/link";

export default function RiderSignupComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#35445C] p-4 animate-fade-in">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Registration Form */}
        <RiderSignupForm />
        {/* Right side - Benefits */}
        <div className="hidden lg:flex flex-col justify-center space-y-6 animate-slide-in-right lg:order-1">
          <Link href={"/"}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative rounded-lg flex items-center justify-center">
                <Image src={"/logo.svg"} alt="Oresema Logo" fill />
              </div>
              <span className="text-3xl font-bold text-white">Oresma</span>
            </div>
          </Link>
          <h1 className="text-5xl font-bold text-white leading-tight text-balance">
            Start your delivery journey today
          </h1>
          <p className="text-xl text-white/90 leading-relaxed">
            Join thousands of riders who trust Oresma for flexible delivery
            opportunities. Start earning on your schedule.
          </p>
          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#F75720] flex items-center justify-center shrink-0 mt-1">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">
                  Flexible Schedule
                </h3>
                <p className="text-white/80">
                  Work when you want, earn on your own time
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#F75720] flex items-center justify-center shrink-0 mt-1">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">
                  Competitive Earnings
                </h3>
                <p className="text-white/80">
                  Get paid fairly for every delivery you complete
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#F75720] flex items-center justify-center shrink-0 mt-1">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">
                  Real-time Support
                </h3>
                <p className="text-white/80">
                  Our team is always here to help you succeed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

