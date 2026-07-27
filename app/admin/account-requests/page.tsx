import React from "react";
import { getAllUsers } from "@/lib/admin/actions/user";
import AccountActions from "./AccountActions";

const page = async () => {
  const allUsers = await getAllUsers();
  const pendingUsers = allUsers.filter((u: any) => u.status === "PENDING");

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-dark-400">
          Account Requests
        </h2>
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
          {pendingUsers.length} pending
        </span>
      </div>

      <div className="mt-7 w-full overflow-x-auto">
        {pendingUsers.length === 0 ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
            <p className="text-lg text-light-500">
              No pending account requests
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-xs uppercase text-light-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">University ID</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingUsers.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-dark-400">
                    {user.fullName}
                  </td>
                  <td className="px-4 py-3 text-light-500">{user.email}</td>
                  <td className="px-4 py-3 text-light-500">
                    {user.universityId}
                  </td>
                  <td className="px-4 py-3 text-light-500">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <AccountActions userId={user.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default page;
