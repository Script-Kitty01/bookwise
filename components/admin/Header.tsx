"use client";

import { Session } from "next-auth";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Header = ({ session }: { session: Session }) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/library?search=${encodeURIComponent(search.trim())}`);
      setOpen(false);
    }
  };

  return (
    <header className="admin-header">
      <div>
        <h2 className="text-2xl font-bold text-white">{session?.user?.name}</h2>
        <p className="text-light-100/40 text-sm mt-1">
          Monitor all of your users and books
        </p>
      </div>

      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-light-100/60 hover:bg-white/10 hover:text-white transition-all duration-300"
        >
          <Image
            src="/icons/admin/search.svg"
            alt="search"
            width={16}
            height={16}
            className="opacity-60"
          />
          Search books...
        </button>

        {open && (
          <form
            onSubmit={handleSearch}
            className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-white/10 bg-dark-400 p-4 shadow-2xl backdrop-blur-xl"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-light-100/40 outline-none focus:border-primary-admin/50 transition-all duration-300"
              autoFocus
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-1.5 text-xs text-light-100/60 hover:bg-white/5 hover:text-white transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary-admin px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-admin/90 shadow-lg shadow-primary-admin/20 transition-all duration-300"
              >
                Search
              </button>
            </div>
          </form>
        )}
      </div>
    </header>
  );
};

export default Header;
