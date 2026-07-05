"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Pill,
  ScanLine,
  User,
  LogOut,
  Stethoscope,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/patient/appointments", label: "Appointments", icon: Calendar },
  {
    href: "/patient/treatments",
    label: "Treatment Plans",
    icon: ClipboardList,
  },
  { href: "/patient/prescriptions", label: "Prescriptions", icon: Pill },
  { href: "/patient/xrays", label: "X-Rays", icon: ScanLine },
  { href: "/patient/profile", label: "Profile", icon: User },
];

interface PatientSidebarProps {
  userName: string;
  patientUid: string;
}

export default function PatientSidebar({
  userName,
  patientUid,
}: PatientSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-white border-r flex flex-col h-full shrink-0">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600 rounded-lg">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900">NextDent</span>
        </div>
        <p className="text-xs text-gray-400 mt-1 ml-1">Patient Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-blue-700" : "text-gray-400",
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <Separator />

      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold">
              {userName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {userName}
            </p>
            <p className="text-xs text-gray-400 font-mono">{patientUid}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors w-full px-1 py-1"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
