"use server";

import { db } from "@/database/drizzle";
import { users, borrowRecords, books } from "@/database/schema";
import { eq, sql, count } from "drizzle-orm";

export const getAllUsers = async () => {
  try {
    const allUsers = await db.select().from(users).orderBy(users.createdAt);
    return JSON.parse(JSON.stringify(allUsers));
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const approveUser = async (userId: string) => {
  try {
    await db
      .update(users)
      .set({ status: "APPROVED" })
      .where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to approve user" };
  }
};

export const rejectUser = async (userId: string) => {
  try {
    await db
      .update(users)
      .set({ status: "REJECTED" })
      .where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to reject user" };
  }
};

export const changeUserRole = async (
  userId: string,
  role: "USER" | "ADMIN",
) => {
  try {
    await db.update(users).set({ role }).where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to change user role" };
  }
};

export const getAdminStats = async () => {
  try {
    const [totalBooks] = await db.select({ count: count() }).from(books);
    const [totalUsers] = await db.select({ count: count() }).from(users);
    const [pendingUsers] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.status, "PENDING"));
    const [activeBorrows] = await db
      .select({ count: count() })
      .from(borrowRecords)
      .where(eq(borrowRecords.status, "BORROWED"));

    return {
      totalBooks: totalBooks?.count ?? 0,
      totalUsers: totalUsers?.count ?? 0,
      pendingApprovals: pendingUsers?.count ?? 0,
      activeBorrows: activeBorrows?.count ?? 0,
    };
  } catch (error) {
    console.log(error);
    return {
      totalBooks: 0,
      totalUsers: 0,
      pendingApprovals: 0,
      activeBorrows: 0,
    };
  }
};

export const getAllBorrowRecords = async () => {
  try {
    const records = await db
      .select({
        id: borrowRecords.id,
        userId: borrowRecords.userId,
        bookId: borrowRecords.bookId,
        borrowDate: borrowRecords.borrowDate,
        dueDate: borrowRecords.dueDate,
        returnDate: borrowRecords.returnDate,
        status: borrowRecords.status,
        createdAt: borrowRecords.createdAt,
        userName: users.fullName,
        userEmail: users.email,
        bookTitle: books.title,
      })
      .from(borrowRecords)
      .leftJoin(users, eq(borrowRecords.userId, users.id))
      .leftJoin(books, eq(borrowRecords.bookId, books.id))
      .orderBy(borrowRecords.createdAt);

    return JSON.parse(JSON.stringify(records));
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const approveBorrow = async (recordId: string) => {
  try {
    await db
      .update(borrowRecords)
      .set({ status: "BORROWED" })
      .where(eq(borrowRecords.id, recordId));

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to approve borrow" };
  }
};

export const markReturned = async (recordId: string) => {
  try {
    const [record] = await db
      .select()
      .from(borrowRecords)
      .where(eq(borrowRecords.id, recordId))
      .limit(1);

    if (!record) return { success: false, message: "Record not found" };

    await db
      .update(borrowRecords)
      .set({
        status: "RETURNED",
        returnDate: new Date().toISOString().slice(0, 10),
      })
      .where(eq(borrowRecords.id, recordId));

    // Increment available copies
    await db
      .update(books)
      .set({ availableCopies: sql`${books.availableCopies} + 1` })
      .where(eq(books.id, record.bookId));

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to mark as returned" };
  }
};
