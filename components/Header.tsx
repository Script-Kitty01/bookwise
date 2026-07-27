"use client";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Session } from "next-auth";

const navLinks = [
  { href: "/library", label: "Library" },
  { href: "/", label: "Home" },
];

const Header = ({ session }: { session: Session }) => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 pt-6 pb-4">
      <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative size-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
            <Image
              src="/icons/logo.svg"
              alt="BookWise"
              width={24}
              height={24}
              priority
              className="group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <span className="hidden sm:block text-lg font-bold text-white tracking-tight">
            Book<span className="text-primary">Wise</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="flex flex-row items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                    pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-light-100/70 hover:text-white hover:bg-white/5",
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              </li>
            ))}
            <li className="ml-2">
              <Link href="/my-profile" className="flex items-center gap-2 pl-2">
                <Avatar className="size-9 ring-2 ring-primary/20 hover:ring-primary/50 transition-all duration-300">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-sm font-semibold">
                    {getInitials(session?.user?.name || "IN")}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
