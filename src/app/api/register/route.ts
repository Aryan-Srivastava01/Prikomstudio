import bcrypt from "bcryptjs";
import { db } from "@/db/dbConnect";
import crypto from "crypto";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendResponse } from "@/utils/sendResponse";
import { sendVerificationEmail } from "@/utils/mailer";

export const POST = async (request: Request) => {
  try {
    const { username, email, password, role } = await request.json();
    const existingEmail = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (existingEmail.length !== 0) {
      return sendResponse(false, "This email already exists", null, 400);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    await db.insert(usersTable).values({
      username,
      email,
      password: hashedPassword,
      role,
      verificationToken,
      isVerified: false,
    });
    await sendVerificationEmail(email, verificationToken);
    return sendResponse(
      true,
      "Verification Email Sent To The Address",
      null,
      201,
    );
  } catch (error) {
    console.error(error);
    return sendResponse(
      false,
      "An error occurred during registration" +
        (error instanceof Error ? error.message : String(error)),
      null,
      500,
    );
  }
};
