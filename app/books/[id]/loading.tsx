import React from "react";

const Loading = () => {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary-admin" />
        <p className="text-light-500">Loading book details...</p>
      </div>
    </section>
  );
};

export default Loading;
