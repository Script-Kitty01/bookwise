"use client";

import React from "react";
import { approveBorrow, markReturned } from "@/lib/admin/actions/user";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Props {
  recordId: string;
  currentStatus: string;
}

const BorrowActions = ({ recordId, currentStatus }: Props) => {
  const router = useRouter();

  const handleApprove = async () => {
    const result = await approveBorrow(recordId);
    if (result.success) {
      toast({ title: "Success", description: "Borrow request approved" });
      router.refresh();
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const handleReturn = async () => {
    const result = await markReturned(recordId);
    if (result.success) {
      toast({ title: "Success", description: "Book marked as returned" });
      router.refresh();
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2">
      {currentStatus === "BORROWED" && (
        <button
          onClick={handleReturn}
          className="text-xs font-medium text-green-600 hover:underline"
        >
          Mark Returned
        </button>
      )}
      {currentStatus === "REQUESTED" && (
        <button
          onClick={handleApprove}
          className="text-xs font-medium text-primary-admin hover:underline"
        >
          Approve
        </button>
      )}
      {currentStatus === "RETURNED" && (
        <span className="text-xs text-light-500">—</span>
      )}
    </div>
  );
};

export default BorrowActions;
