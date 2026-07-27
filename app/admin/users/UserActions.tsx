"use client";

import React from "react";
import {
  approveUser,
  rejectUser,
  changeUserRole,
} from "@/lib/admin/actions/user";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  currentStatus: string;
  currentRole: string;
}

const UserActions = ({ userId, currentStatus, currentRole }: Props) => {
  const router = useRouter();

  const handleApprove = async () => {
    const result = await approveUser(userId);
    if (result.success) {
      toast({ title: "Success", description: "User approved" });
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
      toast({ title: "Success", description: "User rejected" });
      router.refresh();
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleRole = async () => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    const result = await changeUserRole(userId, newRole as "USER" | "ADMIN");
    if (result.success) {
      toast({ title: "Success", description: `Role changed to ${newRole}` });
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
      {currentStatus === "PENDING" && (
        <>
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
        </>
      )}
      <button
        onClick={handleToggleRole}
        className="text-xs font-medium text-primary-admin hover:underline"
      >
        {currentRole === "ADMIN" ? "Demote" : "Make Admin"}
      </button>
    </div>
  );
};

export default UserActions;
