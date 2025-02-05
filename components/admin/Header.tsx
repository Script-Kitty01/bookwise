import { Session } from "next-auth";
import React from "react";

const Header = ({ session }: { session: Session }) => {
  return (
    <header className="admin-header">
      <div className="">
        <h2 className="text-2xl font-semibold text-dark-400">
          {session?.user?.name}
          <p className="text-slate-500">Monitor all of your users and books</p>
        </h2>
      </div>
      <p>search</p>
    </header>
  );
};

export default Header;
