"use client";

import Image from "next/image";
import { adminSideBarLinks } from "@/constants";
import Link from "next/link";
import { cn, getInitials } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";

const Sidebar = ({ session }: { session: Session }) => {
  const pathname = usePathname();

  return (
    <div className="admin-sidebar">
      <div>
        <div className="logo">
          <div className="size-10 rounded-xl bg-primary-admin/10 flex items-center justify-center">
            <Image
              src="/icons/admin/logo.svg"
              alt="logo"
              height={24}
              width={24}
            />
          </div>
          <h1 className="text-2xl font-bold text-white max-md:hidden tracking-tight">
            Book<span className="text-primary-admin">Wise</span>
          </h1>
        </div>

        <div className="mt-10 flex flex-col gap-2">
          {adminSideBarLinks.map((link) => {
            const isSelected =
              (link.route !== "/admin" &&
                pathname.includes(link.route) &&
                link.route.length > 1) ||
              pathname === link.route;

            return (
              <Link href={link.route} key={link.route}>
                <div
                  className={cn(
                    "link",
                    isSelected
                      ? "bg-primary-admin text-white shadow-lg shadow-primary-admin/20"
                      : "text-light-100/60 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <div className="relative size-5">
                    <Image
                      src={link.img}
                      alt="icon"
                      fill
                      className={`${isSelected ? "brightness-0 invert" : "opacity-60"} object-contain`}
                    />
                  </div>

                  <p>{link.text}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="user">
        <Avatar className="size-10 ring-2 ring-primary-admin/20">
          <AvatarFallback className="bg-gradient-to-br from-primary-admin/20 to-primary-admin/10 text-primary-admin text-sm font-semibold">
            {getInitials(session?.user?.name || "IN")}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col max-md:hidden">
          <p className="font-semibold text-white text-sm">
            {session?.user?.name}
          </p>
          <p className="text-xs text-light-100/40">{session?.user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
