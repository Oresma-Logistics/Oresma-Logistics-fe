import { SubHeader } from "@/components/shared/landingpage/sub-header";
// import { title } from "process";
import Image from "next/image";

const teams = [
  {
    name: "Ruthney Ngozi",
    id: 1,
    title: "Secretary",
    img: "https://res.cloudinary.com/duyhha3mz/image/upload/v1764872921/WhatsApp_Image_2025-12-02_at_12.52.18_3ff44854_wfiwgq.jpg",
  },
  {
    name: "Nnaji Jane Chinenye",
    id: 2,
    title: "Assistant Manager",
    img: "https://res.cloudinary.com/duyhha3mz/image/upload/v1764945970/WhatsApp_Image_2025-12-05_at_14.21.28_3cf926db_falwjm.jpg",
  },
  // {
  //   name: "Mayowa Elebute",
  //   id: 3,
  //   title: "Founder",
  //   img: "https://res.cloudinary.com/duyhha3mz/image/upload/v1759716602/db527da01185893706d5f6280b0b2089fff8c5a7_shv1kd.jpg",
  // },
];
export function Team() {
  return (
    <section className="w-full max-7xl mx-auto " id="team">
      <div className="flex flex-col gap-2 items-center py-7">
        <SubHeader title="Our Experts" />
        <p className="text-base font-normal text-center max-w-[500px]">
          Meet our experienced team of logistics professionals dedicated to
          delivering excellence in automobile export and supply chain solutions
        </p>
      </div>
      <div className="flex gap-14 mt-10 justify-center items-center flex-wrap">
        {teams.map((individual) => (
          <div className="w-[296px] h-[337px] relative" key={individual.id}>
            <Image
              src={individual.img}
              alt={individual.name}
              fill
              className="object-cover animate-zoom-in rounded-tl-[96px] rounded-br-[96px]"
            />
            <div className="absolute z-2 -bottom-1 -left-1 w-full h-auto  flex justify-center">
              <div className="py-2 px-9 flex flex-col gap-1 bg-primaryT rounded-md items-center">
                <h2 className="font-semibold text-lg text-center">
                  {individual.name}
                </h2>
                <p className="text-xs font-normal text-white">
                  {individual.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
