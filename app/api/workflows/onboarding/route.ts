import { serve } from "@upstash/workflow/nextjs";
import { sendEmail } from "@/lib/workflow";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

type InitialData = {
  email: string;
  fullName: string;
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload;

  await context.run("new-signup", async () => {
    await sendEmail({
      email,
      subject: "Welcome to BookWise!",
      message: `<h1>Welcome to BookWise, ${fullName}!</h1><p>Your account has been created successfully. An admin will review your registration shortly.</p>`,
    });
  });

  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState(email);
    });

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await sendEmail({
          email,
          subject: "We miss you at BookWise!",
          message: `<h1>Hey ${fullName}!</h1><p>We noticed you haven't been active. Come back and explore our latest books!</p>`,
        });
      });
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await sendEmail({
          email,
          subject: "BookWise Monthly Newsletter",
          message: `<h1>Hello ${fullName}!</h1><p>Here's what's new at BookWise this month. Check out our latest additions!</p>`,
        });
      });
    }

    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
  }
});

type UserState = "non-active" | "active";

const getUserState = async (email: string): Promise<UserState> => {
  try {
    const [user] = await db
      .select({ lastActivityDate: users.lastActivityDate })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user?.lastActivityDate) return "non-active";

    const lastActivity = new Date(user.lastActivityDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return lastActivity > thirtyDaysAgo ? "active" : "non-active";
  } catch {
    return "non-active";
  }
};
