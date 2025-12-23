import { Phone, Mail, MapPin } from "lucide-react";
import {
  FaFacebook,
  FaTiktok,
  FaLinkedin,
} from "react-icons/fa";
import Link from "next/link";
import FooterForm from "./footer-Form";
const ContactData = [
  {
    id: 1,
    bg: "bg-[#35445C]",
    icon: Phone,
    title: ["+234810 854 5892", "+2348131071716", "+234803 290 4556"],
    description: "Give us a call",
  },
  {
    id: 2,
    bg: "bg-[#F75720]",
    icon: Mail,
    title: "oresmalogistic@gmail.com",
    description: "Customer support",
  },
  {
    id: 3,
    bg: "bg-[#35445C]",
    icon: MapPin,
    title: "21 adesan road mowe ogun state",
    description: "Officel Location",
  },
];

const QuickLink = [
  { id: 1, label: "About Us", href: "#aboutus" },
  { id: 2, label: "Services", href: "service" },
  { id: 3, label: "Careers", href: "careers" },
  { id: 4, label: "Pricing", href: "pricing" },
  { id: 5, label: "Contact", href: "contact" },
];
const usefulLink = [
  { id: 1, label: "Privacy Policy", href: "/" },
  { id: 2, label: "Terms and conditions", href: "/" },
  { id: 3, label: "Pricing", href: "/" },
  { id: 4, label: "Support", href: "/" },
  { id: 5, label: "FAQ", href: "/" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-primaryT px-4 py-8 sm:px-6 sm:py-12 md:px-12 md:py-16 lg:px-24 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          {ContactData.map((data) => {
            const Icon = data.icon;
            return (
              <div
                className={`${data.bg} flex text-white gap-4 md:gap-6 lg:gap-8 items-center py-4 px-4 md:px-6 rounded-tl-[20px] rounded-br-[20px]`}
                key={data.id}
              >
                <Icon
                  className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0"
                  color="#fff"
                />
                <div className="flex flex-col gap-2 md:gap-3 min-w-0">
                  <h2 className="font-semibold text-base md:text-lg break-words">
                    {Array.isArray(data.title) ? (
                      <div className="flex flex-col gap-1">
                        {data.title.map((item, index) => (
                          <span key={index}>{item}</span>
                        ))}
                      </div>
                    ) : (
                      data.title
                    )}
                  </h2>
                  <p className="font-normal text-xs md:text-sm">
                    {data.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex text-white mt-10 md:mt-12 gap-12 md:gap-9 flex-col-reverse lg:flex-row">
          {/* Company Info Section */}
          <div className="flex flex-col gap-4 md:gap-5 lg:items-start items-center flex-1">
            <h2 className="font-bold text-2xl md:text-3xl lg:text-start text-center">
              Oresma Logistics
            </h2>
            <p className="text-base md:text-lg font-normal sm:max-w-[550px] lg:text-start text-center">
              Your trusted logistics partner specializing in trucking and dispatch
              delivery services since 2006
            </p>
            <div className="flex gap-4 md:gap-6 flex-wrap">
              <Link
                href="https://www.facebook.com/share/16cMmUyvBW/"
                className="bg-white py-0.5 px-1.5 rounded-full h-10 w-10 md:h-[50px] md:w-[50px] flex justify-center items-center hover:scale-110 transition-transform"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook color="#f75720" className="w-5 h-5 md:w-6 md:h-6" />
              </Link>
              <Link
                href="https://www.tiktok.com/@oresma.logistics"
                className="bg-white py-0.5 px-1.5 rounded-full h-10 w-10 md:h-[50px] md:w-[50px] flex justify-center items-center hover:scale-110 transition-transform"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok color="#f75720" className="w-5 h-5 md:w-6 md:h-6" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/oresma-logistic-78324a393?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                className="bg-white py-0.5 px-1.5 rounded-full h-10 w-10 md:h-[50px] md:w-[50px] flex justify-center items-center hover:scale-110 transition-transform"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin color="#f75720" className="w-5 h-5 md:w-6 md:h-6" />
              </Link>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-6 md:gap-8">
            <div className="flex gap-4 md:gap-6 flex-col lg:items-start items-center">
              <p className="font-normal text-xl md:text-2xl">Quick Links</p>
              <ul className="space-y-2">
                {QuickLink.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="text-base md:text-lg font-normal text-white hover:text-secondaryT transition duration-200 ease-in"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4 md:gap-6 flex-col lg:items-start items-center">
              <p className="font-normal text-xl md:text-2xl">Useful Links</p>
              <ul className="flex flex-col gap-2 max-lg:items-center">
                {usefulLink.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="text-base md:text-lg font-normal text-white hover:text-secondaryT transition duration-200 ease-in"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="flex-1 flex flex-col gap-6 md:gap-8 lg:items-start items-center">
            <div className="space-y-2">
              <h2 className="font-bold text-2xl md:text-3xl lg:text-start text-center">
                Newsletter
              </h2>
              <p className="text-base md:text-lg sm:max-w-[550px] lg:text-start text-center ">
                  Stay updated with the latest logistics solutions, delivery
                  services, and transportation insights. Subscribe to our
                  newsletter for exclusive updates.
              </p>
            </div>
            <FooterForm />
          </div>
        </div>
      </div>
    </footer>
  );
}
