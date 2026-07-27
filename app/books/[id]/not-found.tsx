import React from "react";
import Link from "next/link";

const NotFound = () => {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="font-bebas-neue text-5xl text-light-100">
        Book Not Found
      </h1>
      <p className="mt-3 max-w-md text-light-500">
        The book you&apos;re looking for doesn&apos;t exist or may have been
        removed.
      </p>
      <Link
        href="/library"
        className="mt-6 rounded-lg bg-primary-admin px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
      >
        Browse Library
      </Link>
    </section>
  );
};

export default NotFound;
