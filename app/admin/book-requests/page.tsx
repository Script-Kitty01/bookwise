import React from "react";
import { getAllBorrowRecords } from "@/lib/admin/actions/user";
import BorrowActions from "./BorrowActions";

const page = async () => {
  const records = await getAllBorrowRecords();

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-dark-400">Borrow Requests</h2>
      </div>

      <div className="mt-7 w-full overflow-x-auto">
        {records.length === 0 ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
            <p className="text-lg text-light-500">No borrow records found</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-xs uppercase text-light-500">
              <tr>
                <th className="px-4 py-3 font-medium">Book</th>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Borrow Date</th>
                <th className="px-4 py-3 font-medium">Due Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map((record: any) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-dark-400">
                    {record.bookTitle || "Unknown"}
                  </td>
                  <td className="px-4 py-3 text-light-500">
                    {record.userName || record.userEmail || "Unknown"}
                  </td>
                  <td className="px-4 py-3 text-light-500">
                    {record.borrowDate
                      ? new Date(record.borrowDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-light-500">
                    {record.dueDate
                      ? new Date(record.dueDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        record.status === "RETURNED"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <BorrowActions
                      recordId={record.id}
                      currentStatus={record.status}
                    />
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
