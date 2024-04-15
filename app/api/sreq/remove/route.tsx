import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import supabase, { TABLE_NAMES } from "@/db/supabase";
import { ServiceRequest, User } from "@/db/types";
import { timeAgo } from "@/app/utils/funcs";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams;
  const item_id = params.get("item_id");

  if (!item_id) {
    return NextResponse.json(
      { error: true, message: "item_id not defined!" },
      { status: 500 }
    );
  }

  try {
    const r = await SB.removeServReq(item_id);
    return NextResponse.json(r, { status: 200 });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
