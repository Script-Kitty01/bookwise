import React from "react";
import { getAdminStats } from "@/lib/admin/actions/user";
import Link from "next/link";
import Image from "next/image";

const page = async () => {
  const stats = await getAdminStats();

  const statCards = [
    {
      label: "Total Books",
      count: stats.totalBooks,
      icon: "/icons/admin/book.svg",
      href: "/admin/books",
    },
    {
      label: "Total Users",
      count: stats.totalUsers,
      icon: "/icons/admin/users.svg",
      href: "/admin/users",
    },
    {
      label: "Pending Approvals",
      count: stats.pendingApprovals,
      icon: "/icons/admin/bookmark.svg",
      href: "/admin/account-requests",
    },
    {
      label: "Active Borrows",
      count: stats.activeBorrows,
      icon: "/icons/admin/user.svg",
      href: "/admin/book-requests",
    },
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-white">Dashboard</h2>
      <p className="mt-1 text-sm text-light-100/40">Overview of your library</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href} className="stat group">
            <div className="stat-info">
              <p className="stat-label">{stat.label}</p>
              <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary-admin/10 transition-all duration-300">
                <Image
                  src={stat.icon}
                  alt={stat.label}
                  width={20}
                  height={20}
                  className="size-5 opacity-60 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
            <p className="stat-count">{stat.count}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/admin/books/new" className="add-new-book_btn">
            <div>
              <Image
                src="/icons/admin/book.svg"
                alt="Add book"
                width={24}
                height={24}
                className="opacity-60"
              />
            </div>
            <div>
              <p>Add New Book</p>
              <p className="text-sm text-light-100/40 mt-0.5">
                Add a new book to the library collection
              </p>
            </div>
          </Link>
          <Link href="/admin/account-requests" className="add-new-book_btn">
            <div>
              <Image
                src="/icons/admin/user.svg"
                alt="Review accounts"
                width={24}
                height={24}
                className="opacity-60"
              />
            </div>
            <div>
              <p>Review Account Requests</p>
              <p className="text-sm text-light-100/40 mt-0.5">
                Approve or reject pending user registrations
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
