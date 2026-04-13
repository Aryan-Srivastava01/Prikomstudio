import { db } from "@/db/dbConnect";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token)
    return Response.json({ message: "Missing token" }, { status: 400 });

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.verificationToken, token))
    .limit(1);

  if (!user) {
    return Response.json(
      { message: "Invalid or expired token" },
      { status: 400 },
    );
  }

  await db
    .update(usersTable)
    .set({ isVerified: true, verificationToken: null })
    .where(eq(usersTable.id, user.id));

  // Instead of redirecting here, we just confirm it worked
  return Response.json({ success: true });
};
