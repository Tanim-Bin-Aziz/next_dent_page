"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Treatments", path: "/treatments" },
    { name: "Doctors", path: "/doctors" },
    { name: "Case Studies", path: "#cases" },
    { name: "About", path: "#about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleScrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl"
      >
        <div
          className={`
            rounded-[28px]
            border border-black/10
            backdrop-blur-2xl
            shadow-lg
            transition-all duration-500
            ${
              isScrolled
                ? "bg-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.15)] py-3"
                : "bg-white/20 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            }
          `}
        >
          <div className="px-5 lg:px-8 flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <h1 className="text-2xl font-bold text-black/80">
                Next <span className="text-[#37c4b2]">Dent</span>
              </h1>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isHash = link.path.startsWith("#");

                return isHash ? (
                  <button
                    key={link.name}
                    onClick={() =>
                      handleScrollToSection(link.path.replace("#", ""))
                    }
                    className="relative text-sm font-medium text-black/70 hover:text-[#37c4b2] transition group"
                  >
                    {link.name}

                    {/* UNDERLINE */}
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#37c4b2] rounded-full transition-all duration-300 group-hover:w-full"></span>
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    href={link.path}
                    className={`relative text-sm font-medium transition group ${
                      pathname === link.path
                        ? "text-[#37c4b2]"
                        : "text-black/70 hover:text-[#37c4b2]"
                    }`}
                  >
                    {link.name}

                    {/* UNDERLINE */}
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#37c4b2] rounded-full transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                );
              })}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/contact"
                className="flex items-center gap-2 rounded-full bg-[#37c4b2] px-6 py-3 text-white shadow-md hover:shadow-lg transition"
              >
                Login
              </Link>
            </div>

            {/* Mobile Icon */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-11 h-11 rounded-xl border border-black/10 bg-white/40 backdrop-blur-xl flex items-center justify-center text-black"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-black" />
              ) : (
                <Menu className="w-6 h-6 text-black" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
              backdropFilter: "blur(0px)",
              backgroundColor: "rgba(255,255,255,0)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              backdropFilter: "blur(20px)",
              backgroundColor: "rgba(255,255,255,0.55)",
            }}
            exit={{
              opacity: 0,
              y: -10,
              backdropFilter: "blur(0px)",
              backgroundColor: "rgba(255,255,255,0)",
            }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-40 w-[92%] md:hidden rounded-[24px] border border-black/10 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col p-5 gap-2">
              {navLinks.map((link, i) => {
                const isHash = link.path.startsWith("#");

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {isHash ? (
                      <button
                        onClick={() =>
                          handleScrollToSection(link.path.replace("#", ""))
                        }
                        className="w-full text-left px-4 py-3 rounded-xl text-black/70 hover:text-[#37c4b2] hover:bg-white/30 transition"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <Link
                        href={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-3 rounded-xl text-black/70 hover:text-[#37c4b2] hover:bg-white/30 transition"
                      >
                        {link.name}
                      </Link>
                    )}
                  </motion.div>
                );
              })}

              <Link
                href="/contact"
                className="mt-3 flex items-center justify-center gap-2 rounded-full bg-[#37c4b2] px-5 py-3 text-white shadow-md"
              >
                <Calendar className="w-5 h-5 text-white" />
                Book Appointment
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
