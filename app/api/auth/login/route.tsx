import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";

export async function GET(req: NextRequest) {
  const creds = { phone: "phone", pin: "pin" };

  console.log("post request");
  return NextResponse.json(creds, { status: 200 });
}
