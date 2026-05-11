"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Calendar, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Treatments",
      path: "/treatments",
    },
    {
      name: "Doctors",
      path: "#doctors",
    },
    {
      name: "Case Studies",
      path: "#cases",
    },
    {
      name: "About",
      path: "#about",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ];

  const handleScrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* Floating Navbar */}
      <motion.nav
        initial={{
          y: -100,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.7,
        }}
        className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl"
      >
        <div
          className={`rounded-[30px] border border-white/10 backdrop-blur-2xl transition-all duration-500 ${
            isScrolled
              ? "bg-white/10 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
              : "bg-white/5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
          }`}
        >
          <div className="px-5 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <h1 className="text-2xl font-bold tracking-tight text-black/60">
                  Next
                  <span className="text-[#37c4b2]"> Dent</span>
                </h1>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => {
                  const isHashLink = link.path.startsWith("#");

                  return isHashLink ? (
                    <button
                      key={link.name}
                      onClick={() =>
                        handleScrollToSection(link.path.replace("#", ""))
                      }
                      className="relative text-sm font-medium text-black/60 hover:text-[#37c4b2] transition-all duration-300 group"
                    >
                      {link.name}

                      <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  ) : (
                    <Link
                      key={link.path}
                      href={link.path}
                      className={`relative text-sm font-medium transition-all duration-300 group ${
                        pathname === link.path
                          ? "text-[#37c4b2]"
                          : "text-black/60 hover:text-[#37c4b2]"
                      }`}
                    >
                      {link.name}

                      <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  );
                })}
              </div>

              {/* Desktop CTA */}
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#40e3de] to-[#5f9b81a0] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-[#37c4b2]/30 hover:shadow-[#37c4b2]/50 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Calendar className="w-4 h-4" />

                  <span>Book Appointment</span>
                </Link>
              </div>

              {/* Mobile Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-11 h-11 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center text-white"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            transition={{
              duration: 0.3,
            }}
            className="fixed top-28 left-1/2 -translate-x-1/2 z-40 w-[92%] md:hidden"
          >
            <div className="rounded-[30px] border border-white/10 bg-slate-900/80 backdrop-blur-2xl shadow-2xl overflow-hidden">
              <div className="flex flex-col p-6">
                {navLinks.map((link, index) => {
                  const isHashLink = link.path.startsWith("#");

                  return (
                    <motion.div
                      key={link.name}
                      initial={{
                        opacity: 0,
                        x: 20,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.08,
                      }}
                    >
                      {isHashLink ? (
                        <button
                          onClick={() =>
                            handleScrollToSection(link.path.replace("#", ""))
                          }
                          className="w-full text-left rounded-xl px-4 py-4 text-white/80 hover:text-cyan-400 hover:bg-white/5 transition-all duration-300"
                        >
                          {link.name}
                        </button>
                      ) : (
                        <Link
                          href={link.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block rounded-xl px-4 py-4 text-white/80 hover:text-cyan-400 hover:bg-white/5 transition-all duration-300"
                        >
                          {link.name}
                        </Link>
                      )}
                    </motion.div>
                  );
                })}

                {/* Mobile CTA */}
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#37c4b2] to-[#1e88e5] px-6 py-4 text-white shadow-lg shadow-[#37c4b2]/30"
                >
                  <Calendar className="w-5 h-5" />

                  <span>Book Appointment</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
