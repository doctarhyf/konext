import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import { TABLE_NAMES } from "@/db/supabase";

export const dynamic = "force-dynamic";

/*

 "item_id": 26,
    "posted_by_id": 66,
    "comment": "I’m not going back in the house yet 🔥 😎 🦫 "

*/

export async function POST(req: NextRequest) {
  const commentBody = await req.json();

  console.log("Comment body => ", commentBody);

  try {
    const res = await SB.insertItem(TABLE_NAMES.KOOP_COMMENTS, commentBody);

    console.log("userData => ", res);
    return NextResponse.json(res, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: true, message: `Internal server error. ${JSON.stringify(e)}` },
      { status: 500 }
    );
  }
}
