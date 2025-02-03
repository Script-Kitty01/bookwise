"use client";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { sampleBooks } from "@/constants";
import { Session } from "next-auth";
const Header = ({ session }: { session: Session }) => {
  const pathname = usePathname();
  return (
    <div className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image
          src="/icons/logo.svg"
          alt="logo"
          width={40}
          height={40}
          priority
        />
      </Link>
      <ul className="flex flex-row items-center gap-8">
        <li>
          <Link
            href="/library"
            className={cn(
              "text-base cursor-pointer capitalize",
              pathname === "/library" ? "text-light-200" : "text-light-100"
            )}
          >
            library
          </Link>
          <li>
            <Link href="/my-profile">
              <Avatar>
                <AvatarFallback className="bg-amber-100">
                  {getInitials(session?.user?.name || "IN")}
                </AvatarFallback>
              </Avatar>
            </Link>
          </li>
        </li>
      </ul>
    </div>
  );
};

export default Header;
