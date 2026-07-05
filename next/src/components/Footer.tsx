"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-black">
              Next<span className="text-[#37c4b2]"> Dent</span>
            </h2>

            <p className="mt-3 text-sm text-black/60 leading-relaxed">
              Modern dental care focused on comfort, trust, and long-lasting
              smile solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-black font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-black/60">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/treatments">Treatments</Link>
              </li>
              <li>
                <Link href="/doctors">Doctors</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-black font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-black/60">
              <li>Teeth Cleaning & Whitening</li>
              <li>Dental Implants</li>
              <li>Root Canal Treatment</li>
              <li>Orthodontics</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-black font-semibold mb-4">Contact</h3>

            <div className="space-y-3 text-sm text-black/60">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#37c4b2]" />
                <span>+1 (234) 567-8900</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#37c4b2]" />
                <span>info@nextdent.com</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#37c4b2]" />
                <span>Medical District, NY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-black/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-black/50">
            © {new Date().getFullYear()} NextDent. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-black/60">
            <Link href="#" className="hover:text-black">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-black">
              Terms
            </Link>
            <Link href="#" className="hover:text-black">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
