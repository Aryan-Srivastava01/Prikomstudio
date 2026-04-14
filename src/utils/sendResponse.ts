import { NextResponse } from "next/server";

export const sendResponse = <T>(
  success: boolean,
  message: string,
  data: T,
  status: number = 200,
) => {
  return NextResponse.json(
    {
      success,
      message,
      data,
      error: success ? "" : message,
    },
    { status },
  );
};
