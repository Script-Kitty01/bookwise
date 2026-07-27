import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { hash } from "bcryptjs";
import { users } from "../database/schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

async function seed() {
  const password = await hash("admin123", 10);

  await db.insert(users).values({
    fullName: "Admin User",
    email: "admin@bookwise.com",
    universityId: 1000001,
    password,
    universityCard: "admin-card",
    status: "APPROVED",
    role: "ADMIN",
  });

  console.log("✅ Admin user created!");
  console.log("   Email:    admin@bookwise.com");
  console.log("   Password: admin123");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
