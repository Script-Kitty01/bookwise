import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { books } from "../database/schema";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

async function seed() {
  const filePath = path.join(process.cwd(), "public", "books.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const bookData = JSON.parse(raw);

  for (const book of bookData) {
    await db.insert(books).values({
      id: book.id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      rating: book.rating,
      coverUrl: book.coverUrl,
      coverColor: book.coverColor,
      description: book.description,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      videoUrl: book.videoUrl,
      summary: book.summary,
    });
  }

  console.log(`✅ ${bookData.length} books inserted!`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
