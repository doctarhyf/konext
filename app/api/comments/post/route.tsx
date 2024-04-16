import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import { TABLE_NAMES } from "@/db/supabase";
import { ITEM_TYPE } from "@/db/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const commentBody = await req.json();
  const { item_id, item_type } = commentBody;

  console.log("Comment body => ", commentBody);
  if (!item_id || !item_type) {
    return NextResponse.json(
      { error: true, message: `item_id and item_type not defined!` },
      { status: 500 }
    );
  }

  try {
    const res = await SB.insertItem(TABLE_NAMES.KOOP_COMMENTS, commentBody);
    const count = await SB.countItemComments(item_id, item_type);

    let updTable =
      item_type === ITEM_TYPE.SERVICE_REQUEST
        ? TABLE_NAMES.KOOP_SERVICE_REQUEST
        : TABLE_NAMES.KOOP_USERS;

    const upd = await SB.updateItem(updTable, item_id, {
      comments_count: count,
    });

    console.log("userData => ", res);
    return NextResponse.json(res, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: true, message: `Internal server error. ${JSON.stringify(e)}` },
      { status: 500 }
    );
  }
}
