import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import { TABLE_NAMES } from "@/db/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const creds = await req.json();
  const { phone, pin } = creds;

  
  if (creds) {
    const userData = await SB.createUser(phone, pin);

    console.log("userData => ", userData);
    return NextResponse.json(userData, { status: 200 });
  }

  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
