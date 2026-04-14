import { db } from "@/db/dbConnect";
import { usersTable } from "@/db/schema";
import { sendResponse } from "@/utils/sendResponse";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { email, password } = await request.json();
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user) {
      return sendResponse(false, "Invalid Email or Password", null, 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendResponse(false, "Invalid Email or Password", null, 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
    );
    const response = sendResponse(
      true,
      "Login successful",
      {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        token,
      },
      200,
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    return sendResponse(false, "Internal Server Error" + error, null, 500);
  }
};
