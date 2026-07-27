"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { returnBook } from "@/lib/actions/book";

interface Props {
  userId: string;
  bookId: string;
}

const ReturnBook = ({ userId, bookId }: Props) => {
  const router = useRouter();
  const [returning, setReturning] = useState(false);

  const handleReturn = async () => {
    setReturning(true);

    try {
      const result = await returnBook({ bookId, userId });

      if (result.success) {
        toast({
          title: "Success",
          description: "Book returned successfully",
        });
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An error occurred while returning the book",
        variant: "destructive",
      });
    } finally {
      setReturning(false);
    }
  };

  return (
    <Button className="book-btn" onClick={handleReturn} disabled={returning}>
      {returning ? "Returning..." : "Return Book"}
    </Button>
  );
};

export default ReturnBook;
