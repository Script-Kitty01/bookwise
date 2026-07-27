"use client";

import React, { useState } from "react";
import { deleteBook } from "@/lib/admin/actions/book";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const DeleteBookButton = ({ bookId }: { bookId: string }) => {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    const result = await deleteBook(bookId);

    if (result.success) {
      toast({
        title: "Success",
        description: "Book deleted successfully",
      });
      router.refresh();
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
      setConfirming(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className={`text-xs font-medium hover:underline ${
        confirming ? "text-red-600" : "text-red-400"
      }`}
    >
      {confirming ? "Confirm Delete?" : "Delete"}
    </button>
  );
};

export default DeleteBookButton;
