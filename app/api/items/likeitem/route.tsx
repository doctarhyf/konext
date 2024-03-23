import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import { TABLE_NAMES } from "@/db/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const data = await req.json();

  if (data && data.item_id && data.user_id) {
    const likeItem = await SB.loadItemWithCondition(
      TABLE_NAMES.KOOP_ITEMS_LIKES,
      data
    );

    if (likeItem.code) {
      //error, doesnt exist so like it
      const insres = await SB.insertItem(TABLE_NAMES.KOOP_ITEMS_LIKES, data);
      console.log("insres => ", insres);
      return NextResponse.json(insres, { status: 200 });
    } else {
      //dislike, remove it
      const delres = await SB.removeItem(TABLE_NAMES.KOOP_ITEMS_LIKES, data);
      console.log("delres => ", delres);
      return NextResponse.json(delres, { status: 200 });
    }
  } else {
    return NextResponse.json(
      { error: true, message: "Params keys not complete", ...data },
      { status: 200 }
    );
  }

  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
