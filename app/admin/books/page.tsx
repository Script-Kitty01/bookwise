import Link from "next/link";
import React from "react";
import { getAllBooks, deleteBook } from "@/lib/admin/actions/book";
import { Button } from "@/components/ui/button";
import DeleteBookButton from "./DeleteBookButton";

const page = async () => {
  const books = await getAllBooks();

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-dark-400">All Books</h2>
        <Button className="bg-primary-admin hover:bg-primary-admin/90" asChild>
          <Link className="text-light-100" href="/admin/books/new">
            + Create a New Book
          </Link>
        </Button>
      </div>

      <div className="mt-7 w-full overflow-x-auto">
        {books.length === 0 ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
            <p className="text-lg text-light-500">No books found</p>
            <Link
              href="/admin/books/new"
              className="mt-2 text-primary-admin hover:underline"
            >
              Add your first book
            </Link>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-xs uppercase text-light-500">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Author</th>
                <th className="px-4 py-3 font-medium">Genre</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Copies</th>
                <th className="px-4 py-3 font-medium">Available</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {books.map((book: Book) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-dark-400">
                    {book.title}
                  </td>
                  <td className="px-4 py-3 text-light-500">{book.author}</td>
                  <td className="px-4 py-3 text-light-500">{book.genre}</td>
                  <td className="px-4 py-3 text-light-500">{book.rating}/5</td>
                  <td className="px-4 py-3 text-light-500">
                    {book.totalCopies}
                  </td>
                  <td className="px-4 py-3 text-light-500">
                    {book.availableCopies}
                  </td>
                  <td className="flex gap-2 px-4 py-3">
                    <Link
                      href={`/admin/books/${book.id}`}
                      className="text-xs font-medium text-primary-admin hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteBookButton bookId={book.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default page;
