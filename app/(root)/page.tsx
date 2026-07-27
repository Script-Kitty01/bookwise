import { auth } from "@/auth";
import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";

import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc } from "drizzle-orm";

const Home = async () => {
  const session = await auth();
  const latestBooks = (await db
    .select()
    .from(books)
    .limit(10)
    .orderBy(desc(books.createdAt))) as Book[];

  if (latestBooks.length === 0) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="font-bebas-neue text-4xl text-light-100">
          No Books Yet
        </h1>
        <p className="mt-3 max-w-md text-light-500">
          The library is currently empty. Check back soon for new additions!
        </p>
      </section>
    );
  }

  return (
    <>
      <BookOverview {...latestBooks[0]} userId={session?.user?.id as string} />
      <BookList
        title="Latest Books"
        books={latestBooks.slice(1)}
        containerClassName="mt-28"
      />
    </>
  );
};
export default Home;
