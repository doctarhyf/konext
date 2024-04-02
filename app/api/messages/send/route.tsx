import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import { TABLE_NAMES } from "@/db/supabase";

export const dynamic = "force-dynamic";

// api route : GET /sreq?user_id

export async function POST(req: NextRequest) {
  const message = await req.json();
  const { from_id, to_id, content } = message;

  console.log("Message data => ", message);

  if (message) {
    const res = await SB.sendMessage(message);

    console.log("userData => ", res);
    return NextResponse.json(res, { status: 200 });
  }

  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
