import React from "react";
import type { Metadata } from "next";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc, eq, like, or } from "drizzle-orm";
import BookCard from "@/components/BookCard";

export const metadata: Metadata = {
  title: "Library",
  description: "Browse and search our complete collection of books.",
};

interface SearchParams {
  search?: string;
  genre?: string;
}

const page = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { search, genre } = await searchParams;

  let query = db.select().from(books).$dynamic();

  if (search) {
    query = query.where(
      or(like(books.title, `%${search}%`), like(books.author, `%${search}%`)),
    );
  }

  if (genre) {
    query = query.where(eq(books.genre, genre));
  }

  const allBooks = (await query
    .orderBy(desc(books.createdAt))
    .limit(50)) as Book[];

  // Get unique genres for filter
  const genres = [...new Set(allBooks.map((b) => b.genre))].sort();

  return (
    <section className="min-h-screen animate-fade-in">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="section-heading">Library</h1>
          <p className="mt-1 text-sm text-light-100/50">
            Browse and discover your next great read
          </p>
        </div>

        {/* Search & Filter */}
        <form className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by title or author..."
              className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 pl-10 text-sm text-white placeholder:text-light-100/40 outline-none transition-all duration-300 focus:border-primary/40 focus:bg-white/8 focus:ring-2 focus:ring-primary/10"
            />
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-light-100/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select
            name="genre"
            defaultValue={genre || ""}
            className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-primary/40 cursor-pointer"
          >
            <option value="" className="bg-dark-500">
              All Genres
            </option>
            {genres.map((g) => (
              <option key={g} value={g} className="bg-dark-500">
                {g}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-primary to-primary/80 px-6 py-3 text-sm font-semibold text-dark-100 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            Filter
          </button>
          {(search || genre) && (
            <a
              href="/library"
              className="rounded-xl border border-white/10 px-5 py-3 text-sm text-light-100/60 transition-all duration-300 hover:bg-white/5 hover:text-white"
            >
              Clear
            </a>
          )}
        </form>

        {/* Results */}
        {allBooks.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
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
            <p className="text-lg text-light-100/50">
              No books found matching your criteria.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-light-100/40">
              {allBooks.length} book{allBooks.length !== 1 ? "s" : ""} found
            </p>
            <ul className="book-list">
              {allBooks.map((book) => (
                <BookCard key={book.id} {...book} />
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
};

export default page;
