"use client";

import React from "react";
import { Button } from "@/components/ui/button";

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h2 className="font-bebas-neue text-3xl text-light-100">
        Something went wrong
      </h2>
      <p className="mt-2 max-w-md text-light-500">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button onClick={reset} className="mt-6">
        Try Again
      </Button>
    </section>
  );
};

export default Error;
