import React from "react";
import { cn } from "@/lib/utils";
import BookCard from "@/components/BookCard";

interface Props {
  title: string;
  books: Book[];
  containerClassName?: string;
}

const BookList = ({ title, books, containerClassName }: Props) => {
  if (books.length === 0) return null;

  return (
    <section className={cn("animate-slide-up", containerClassName)}>
      <div className="flex items-center gap-4 mb-2">
        <h2 className="section-heading">{title}</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
      </div>

      <ul className="book-list">
        {books.map((book) => (
          <BookCard key={book.title} {...book} />
        ))}
      </ul>
    </section>
  );
};
export default BookList;
