import { SubHeader } from "@/components/shared/landingpage/sub-header";
import { Button } from "@/components/ui/button";
import Thumbs from "@/assest/thumbs.svg";
import PeopleThumbs from "@/assest/peopleThumbs.svg";
import Image from "next/image";
export default function Services() {
  return (
    <section
      className="w-full relative  max-w-7xl mx-auto px-0 py-2"
      id="services"
    >
      <div className="flex md:flex-row flex-col lg::gap-17 md:gap-15 gap-13 mt-10 justify-center max-md:items-center">
        <div className="flex flex-col md:gap-15 gap-13 md:items-start items-center">
          <div className="flex flex-col items-center">
            <SubHeader title="Our Services" />
            <div>
              <Button
                className="bg-[#F75720] hover:bg-[#F75720]/90 text-primary-foreground hover:scale-105 transition-transform duration-300 animate-fade-in-up animate-pulse-subtle rounded-tl-3xl rounded-br-3xl mt-6 text-xs"
                style={{ animationDelay: "0.4s" }}
              >
                VIEW ALL SERVICES
              </Button>
            </div>
          </div>
          <div className="px-4 py-8 border border-[#B1B6C0] flex flex-col gap-[19px] rounded-tl-[96px] rounded-br-[96px] max-w-[260px]">
            <Image
              src={PeopleThumbs}
              height={80}
              width={80}
              alt="peopleTumbs"
              className="ml-5"
            />
            <div>
              <h4 className="font-semibold text-base">
                Lorem ipsum dolor sit amet
              </h4>
              <p className="text-sm">
                {" "}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col max-md:flex-col-reverse md:gap-15 gap-13 md:translate-y-12">
          <div className="px-4 py-8  flex flex-col gap-[19px] rounded-tl-[96px] rounded-br-[96px] max-w-[260px] bg-secondaryT">
            <svg
              width="60"
              height="61"
              viewBox="0 0 60 61"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-5"
            >
              <path
                d="M38.9167 12.3167L36 24.3333H53.0042C53.9098 24.3333 54.8029 24.5442 55.6129 24.9492C56.4229 25.3542 57.1275 25.9422 57.6708 26.6667C58.2142 27.3911 58.5814 28.2322 58.7434 29.1232C58.9054 30.0142 58.8577 30.9306 58.6042 31.8L51.8083 55.1333C51.4549 56.345 50.7181 57.4094 49.7083 58.1667C48.6986 58.924 47.4705 59.3333 46.2083 59.3333H6.83333C5.28624 59.3333 3.80251 58.7188 2.70854 57.6248C1.61458 56.5308 1 55.0471 1 53.5V30.1667C1 28.6196 1.61458 27.1358 2.70854 26.0419C3.80251 24.9479 5.28624 24.3333 6.83333 24.3333H14.8833C15.9686 24.3328 17.0321 24.0295 17.9545 23.4575C18.8768 22.8856 19.6212 22.0677 20.1042 21.0958L30.1667 1C31.5421 1.01703 32.8959 1.34466 34.1269 1.95841C35.358 2.57215 36.4344 3.45615 37.2758 4.54434C38.1172 5.63254 38.7018 6.8968 38.9859 8.24267C39.27 9.58854 39.2464 10.9812 38.9167 12.3167Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-white">
              <h4 className="font-semibold text-base">
                Lorem ipsum dolor sit amet
              </h4>
              <p className="text-sm">
                {" "}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              </p>
            </div>
          </div>
          <div className="px-4 py-8 border border-[#B1B6C0] flex flex-col gap-[19px] rounded-tl-[96px] rounded-br-[96px] max-w-[260px]">
            <Image
              src={PeopleThumbs}
              height={80}
              width={80}
              alt="peopleTumbs"
              className="ml-5"
            />
            <div>
              <h4 className="font-semibold text-base">
                Lorem ipsum dolor sit amet
              </h4>
              <p className="text-sm">
                {" "}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:gap-15 gap-13 md:-translate-y-12">
          <div className="px-4 py-8 border border-[#B1B6C0] flex flex-col gap-[19px] rounded-tl-[96px] rounded-br-[96px] max-w-[260px]">
            <Image
              src={PeopleThumbs}
              height={80}
              width={80}
              alt="peopleTumbs"
              className="ml-5"
            />
            <div>
              <h4 className="font-semibold text-base">
                Lorem ipsum dolor sit amet
              </h4>
              <p className="text-sm">
                {" "}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              </p>
            </div>
          </div>
          <div className="px-4 py-8 border border-[#B1B6C0] flex flex-col gap-[19px] rounded-tl-[96px] rounded-br-[96px] max-w-[260px]">
            <Image
              src={PeopleThumbs}
              height={80}
              width={80}
              alt="peopleTumbs"
              className="ml-5"
            />
            <div>
              <h4 className="font-semibold text-base">
                Lorem ipsum dolor sit amet
              </h4>
              <p className="text-sm">
                {" "}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
