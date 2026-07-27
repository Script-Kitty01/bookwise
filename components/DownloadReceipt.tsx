"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface Props {
  bookTitle: string;
  author: string;
  borrowDate: string;
  dueDate: string;
  userName: string;
}

const DownloadReceipt = ({
  bookTitle,
  author,
  borrowDate,
  dueDate,
  userName,
}: Props) => {
  const handleDownload = () => {
    const receipt = `
========================================
           BOOKWISE — BORROW RECEIPT
========================================

  Book:     ${bookTitle}
  Author:   ${author}
  Borrower: ${userName}

  Borrowed: ${borrowDate}
  Due Date: ${dueDate}

========================================
  Please return by the due date.
  Thank you for using BookWise!
========================================
    `.trim();

    const blob = new Blob([receipt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookwise-receipt-${bookTitle.replace(/\s+/g, "-").toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button className="book-btn" onClick={handleDownload}>
      Download receipt
    </Button>
  );
};

export default DownloadReceipt;
