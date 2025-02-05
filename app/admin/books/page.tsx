import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <>
      <section className="w-full rounded-2xl bg-white p-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">All Books</h2>
          <button className="bg-primary-admin">
            <Link className="text-light-100" href="/admin/books/new">
              + Create a New Book
            </Link>
          </button>
        </div>
        <div className="mt-7 w-full overflow-hidden">
          <p>Table</p>
        </div>
      </section>
    </>
  );
};

export default page;
