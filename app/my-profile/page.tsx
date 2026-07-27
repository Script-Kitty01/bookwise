import { auth, signOut } from "@/auth";
import BookCard from "@/components/BookCard";
import ReturnBook from "@/components/ReturnBook";
import { Button } from "@/components/ui/button";
import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import React from "react";

const page = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  let borrowedBooks: (Book & { dueDate: string | null })[] = [];

  if (userId) {
    const records = await db
      .select({
        book: books,
        borrowDate: borrowRecords.borrowDate,
        dueDate: borrowRecords.dueDate,
        status: borrowRecords.status,
      })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .where(
        and(
          eq(borrowRecords.userId, userId),
          eq(borrowRecords.status, "BORROWED"),
        ),
      );

    borrowedBooks = records.map((r) => ({
      ...r.book,
      isLoanedBook: true,
      dueDate: r.dueDate,
      borrowDate: r.borrowDate,
      userName: session?.user?.name || "User",
    })) as (Book & {
      dueDate: string | null;
      borrowDate: string | null;
      userName: string;
    })[];
  }

  return (
    <div className="animate-fade-in">
      {/* Profile Header */}
      <div className="glass rounded-2xl p-6 mb-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-primary/20">
            <span className="text-xl font-bold text-primary">
              {session?.user?.name?.charAt(0) || "U"}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              {session?.user?.name || "User"}
            </h1>
            <p className="text-sm text-light-100/50">
              {session?.user?.email || ""}
            </p>
          </div>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button className="rounded-xl border border-white/10 bg-white/5 text-light-100/70 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-300">
            Sign Out
          </Button>
        </form>
      </div>

      {borrowedBooks.length > 0 ? (
        <section className="animate-slide-up">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="section-heading">Borrowed Books</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>
          <ul className="book-list">
            {borrowedBooks.map((book) => (
              <BookCard key={book.id} {...book} dueDate={book.dueDate}>
                <ReturnBook userId={userId!} bookId={book.id} />
              </BookCard>
            ))}
          </ul>
        </section>
      ) : (
        <section className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <svg
              className="size-8 text-light-100/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h2 className="section-heading text-3xl">No Borrowed Books</h2>
          <p className="mt-2 text-light-100/40">
            You haven&apos;t borrowed any books yet. Browse the library to get
            started!
          </p>
        </section>
      )}
    </div>
  );
};

export default page;
