import Image from "next/image";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="auth-container">
      <section className="auth-form">
        <div className="auth-box">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Image src="/icons/logo.svg" alt="logo" width={28} height={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Book<span className="text-primary">Wise</span>
              </h1>
              <p className="text-xs text-light-100/50">Your Digital Library</p>
            </div>
          </div>
          <div>{children}</div>
        </div>
      </section>
      <section className="auth-illustration">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent rounded-3xl blur-2xl" />
          <Image
            src="/images/auth-illustration.png"
            alt="auth illustration"
            height={800}
            width={800}
            className="relative size-full object-cover rounded-3xl"
          />
        </div>
      </section>
    </main>
  );
};

export default layout;
