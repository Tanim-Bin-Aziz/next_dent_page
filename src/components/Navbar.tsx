"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ─── Auth state ───────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient();

    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setUserName(null);
        setUserRole(null);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("name, role")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUserName(profile.name);
        setUserRole(profile.role);
      }
    };

    fetchProfile();

    // realtime auth change (login/logout করলে auto update)
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserName(null);
    setUserRole(null);
    router.push("/login");
  };

  const getDashboardLink = () => {
    if (userRole === "admin") return "/admin/dashboard";
    if (userRole === "doctor") return "/doctor/dashboard";
    return "/patient/dashboard";
  };

  // ─────────────────────────────────────────────────────────

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
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl"
      >
        <div
          className={`
            rounded-[28px] border border-black/10 backdrop-blur-2xl shadow-lg
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
                    <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-[#37c4b2] rounded-full transition-all duration-300 group-hover:w-full" />
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
                    <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-[#37c4b2] rounded-full transition-all duration-300 group-hover:w-full" />
                  </Link>
                );
              })}
            </div>

            {/* CTA — Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {userName ? (
                // ── Logged in state ──
                <div className="flex items-center gap-3">
                  <Link
                    href={getDashboardLink()}
                    className="flex items-center gap-2 rounded-full bg-white/60 border border-black/10 px-4 py-2 text-sm font-medium text-black/70 hover:bg-white/80 transition"
                  >
                    <User className="w-4 h-4 text-[#37c4b2]" />
                    {userName}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-full bg-red-50 border border-red-200 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-100 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                // ── Logged out state ──
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-full bg-[#37c4b2] px-6 py-3 text-white shadow-md hover:shadow-lg transition"
                >
                  Login
                </Link>
              )}
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-40 w-[92%] md:hidden rounded-[24px] border border-black/10 shadow-xl overflow-hidden bg-white/55 backdrop-blur-xl"
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

              {/* Mobile — Auth section */}
              <div className="mt-3 border-t border-black/10 pt-3 flex flex-col gap-2">
                {userName ? (
                  <>
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-black/70 hover:bg-white/30 transition text-sm font-medium"
                    >
                      <User className="w-4 h-4 text-[#37c4b2]" />
                      {userName} — Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition text-sm font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-full bg-[#37c4b2] px-5 py-3 text-white shadow-md"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
