import { SubHeader } from "@/components/shared/landingpage/sub-header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
export default function CaseStudy() {
  return (
    <section className="w-full max-7xl mx-auto ">
      <div className="flex flex-col gap-2 items-center">
        <SubHeader title="Case Studies" />
      </div>
      <div className=" w-full flex justify-center mt-10 lg:h-[400px] md:h-[350px]">
        <div className="w-full max-w-5xl bg-[#E6E8EB] h-auto md:py-8 md:px-5 py-6 px-3 flex sm:flex-row flex-col-reverse  sm:gap-5 gap-7 rounded-md relative">
          <div className="flex-1 flex items-center sm:justify-start justify-center md:py-5">
            <div>
              <h2 className="font-semibold text-[1.75rem] text-primaryT sm:text-start text-center">
                Our Mission
              </h2>
              <p className="mt-7 font-normal text-lg text-primaryT max-w-[370px] max-sm:text-center">
                To empower businesses with reliable, efficient trucking and dispatch
                delivery solutions that connect communities and drive commerce forward.
                We are committed to excellence, safety, and building lasting partnerships
                through dependable logistics services.
              </p>
              <div className="flex sm:justify-start justify-center">
                <Button className="mt-10 border-t-4 border-secondaryT py-4 text-primaryT font-normal text-sm bg-transparent rounded-none">
                  Read more
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-center sm:absolute bottom-0  h-auto w-auto">
              <div className="relative lg:h-[334px] lg:w-[359px] md:h-[280px] md:w-[305px] h-[250px] w-[275px]">
                <Image
                  src={
                    "https://res.cloudinary.com/duyhha3mz/image/upload/v1759733596/1aece6240f0561a6792f531b857bb35aadebad78_ypstc8.png"
                  }
                  alt="handPhone"
                  fill
                  className="object-cover rotate-360 transform scale-x-[-1]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
