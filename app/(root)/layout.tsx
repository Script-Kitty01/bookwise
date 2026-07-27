import { ReactNode } from "react";
import Header from "@/components/Header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session) redirect("/sign-in");

  // Update last activity date (fire-and-forget, non-blocking)
  if (session?.user?.id) {
    const today = new Date().toISOString().slice(0, 10);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (user && user.lastActivityDate !== today) {
      db.update(users)
        .set({ lastActivityDate: today })
        .where(eq(users.id, session.user.id))
        .execute()
        .catch(() => {
          // Silently ignore — non-critical update
        });
    }
  }

  return (
    <main className="root-container">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Header session={session} />

        <div className="mt-6 pb-20">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
