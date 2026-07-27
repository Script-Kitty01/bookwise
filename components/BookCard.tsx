import React from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { cn } from "@/lib/utils";
import Image from "next/image";
import dayjs from "dayjs";
import DownloadReceipt from "@/components/DownloadReceipt";

interface BookCardProps extends Book {
  dueDate?: string | null;
  borrowDate?: string | null;
  userName?: string;
  children?: React.ReactNode;
}

const BookCard = ({
  id,
  title,
  author,
  genre,
  coverColor,
  coverUrl,
  isLoanedBook = false,
  dueDate,
  borrowDate,
  userName,
  children,
}: BookCardProps) => {
  const daysLeft = dueDate ? dayjs(dueDate).diff(dayjs(), "day") : null;

  return (
    <li className={cn("group", isLoanedBook && "xs:w-52 w-full")}>
      <Link
        href={`/books/${id}`}
        className={cn(
          "block card-hover",
          isLoanedBook && "w-full flex flex-col items-center",
        )}
      >
        <div className="relative overflow-hidden rounded-2xl">
          <BookCover coverColor={coverColor} coverImage={coverUrl} />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-500/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className={cn("mt-4", !isLoanedBook && "xs:max-w-40 max-w-28")}>
          <p className="book-title">{title}</p>
          <p className="book-genre">{genre}</p>
        </div>

        {isLoanedBook && (
          <div className="mt-3 w-full">
            <div className="book-loaned">
              <Image
                src="/icons/calendar.svg"
                alt="calendar"
                width={18}
                height={18}
                className="object-contain opacity-70"
              />
              <p className="text-light-100/80 text-sm">
                {daysLeft !== null
                  ? daysLeft > 0
                    ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left to return`
                    : daysLeft === 0
                      ? "Due today"
                      : `${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? "" : "s"} overdue`
                  : "Return date unknown"}
              </p>
            </div>

            <DownloadReceipt
              bookTitle={title}
              author={author}
              borrowDate={
                borrowDate ? new Date(borrowDate).toLocaleDateString() : "N/A"
              }
              dueDate={dueDate ? new Date(dueDate).toLocaleDateString() : "N/A"}
              userName={userName || "User"}
            />
          </div>
        )}
      </Link>
      {children}
    </li>
  );
};

export default BookCard;
