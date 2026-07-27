import React from "react";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq, ne, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import BookOverview from "@/components/BookOverview";
import BookList from "@/components/BookList";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const session = await auth();

  const [book] = (await db
    .select()
    .from(books)
    .where(eq(books.id, id))
    .limit(1)) as Book[];

  if (!book) notFound();

  // Fetch related books (same genre, excluding current)
  const relatedBooks = (await db
    .select()
    .from(books)
    .where(and(eq(books.genre, book.genre), ne(books.id, id)))
    .limit(5)) as Book[];

  return (
    <>
      <BookOverview {...book} userId={session?.user?.id as string} />
      {relatedBooks.length > 0 && (
        <BookList
          title="Similar Books"
          books={relatedBooks}
          containerClassName="mt-28"
        />
      )}
    </>
  );
};

export default page;
