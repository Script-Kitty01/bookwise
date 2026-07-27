"use server";

import { books, borrowRecords } from "@/database/schema";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";

export const createBook = async (params: BookParams) => {
  try {
    const newBook = await db
      .insert(books)
      .values({
        ...params,
        availableCopies: params.totalCopies,
      })
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while creating the book",
    };
  }
};

export const updateBook = async (id: string, params: Partial<BookParams>) => {
  try {
    const updated = await db
      .update(books)
      .set(params)
      .where(eq(books.id, id))
      .returning();

    if (!updated.length) {
      return { success: false, message: "Book not found" };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updated[0])),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occurred while updating the book",
    };
  }
};

export const deleteBook = async (id: string) => {
  try {
    const activeBorrows = await db
      .select()
      .from(borrowRecords)
      .where(eq(borrowRecords.bookId, id));

    if (activeBorrows.length > 0) {
      return {
        success: false,
        message: "Cannot delete book with active borrow records",
      };
    }

    await db.delete(books).where(eq(books.id, id));

    return { success: true };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occurred while deleting the book",
    };
  }
};

export const getAllBooks = async () => {
  try {
    const allBooks = await db.select().from(books).orderBy(books.createdAt);
    return JSON.parse(JSON.stringify(allBooks));
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getBookById = async (id: string) => {
  try {
    const [book] = await db
      .select()
      .from(books)
      .where(eq(books.id, id))
      .limit(1);
    return book ? JSON.parse(JSON.stringify(book)) : null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
