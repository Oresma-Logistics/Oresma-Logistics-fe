"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", href: "#home" },
    { name: "ABOUT", href: "#about" },
    { name: "SERVICES", href: "#services" },
    { name: "TEAM", href: "#team" },
    { name: "PROCESS", href: "#process" },
    { name: "CONTACT", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-primaryT shadow-md py-2" : "bg-primaryT shadow-sm py-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="shrink-0">
            <Link href={"#"}>
              <div className="flex items-center gap-3 ">
                <div className="w-12 h-12  rounded-lg flex items-center justify-center relative">
                  <Image src={"/logo.svg"} alt="Oresema Logo" fill />
                </div>

                <span className="text-3xl font-bold text-secondaryT">
                  Oresma
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-white hover:text-primaryT transition-all duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:block">
            <Button
              className="w-full bg-[#F75720] hover:bg-[#F75720]/90 text-primary-foreground hover:scale-105 transition-transform duration-300 rounded-tl-3xl rounded-br-3xl"
              asChild
            >
              <Link href={"/auth/login"}>GET STARTED</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-white transition-all duration-300 hover:rotate-90"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="lg:hidden bg-primaryT border-t border-border animate-slide-down"
        >
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-2 text-sm font-medium text-white hover:text-primaryT hover:bg-accent rounded-md transition-all duration-300 hover:translate-x-2 animate-fade-in-up"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2">
              <Button
                className="w-full bg-[#F75720] hover:bg-[#F75720]/90 text-primary-foreground hover:scale-105 transition-transform duration-300 rounded-tl-3xl rounded-br-3xl"
                asChild
              >
                <Link href={"/auth/login"}>GET STARTED</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
