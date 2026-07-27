"use client";

import React from "react";
import { approveUser, rejectUser } from "@/lib/admin/actions/user";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
}

const AccountActions = ({ userId }: Props) => {
  const router = useRouter();

  const handleApprove = async () => {
    const result = await approveUser(userId);
    if (result.success) {
      toast({ title: "Success", description: "Account approved" });
      router.refresh();
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    const result = await rejectUser(userId);
    if (result.success) {
      toast({ title: "Success", description: "Account rejected" });
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
      <button
        onClick={handleApprove}
        className="text-xs font-medium text-green-600 hover:underline"
      >
        Approve
      </button>
      <button
        onClick={handleReject}
        className="text-xs font-medium text-red-400 hover:underline"
      >
        Reject
      </button>
    </div>
  );
};

export default AccountActions;
