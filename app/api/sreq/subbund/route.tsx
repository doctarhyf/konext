import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import supabase, { TABLE_NAMES } from "@/db/supabase";
import { ServiceRequest, User } from "@/db/types";
import { timeAgo } from "@/app/utils/funcs";
import { error } from "console";

//sub bund for "subscriotions bundles"

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams;
  const type = params.get("type");

  if (type && type !== "") {
    try {
      const subscriptions_bundles = await SB.loadAllItemsWithCondition(
        TABLE_NAMES.KOOP_SUBSCRIPTIONS_BUNDLES,
        "type",
        type
      );

      console.log(`subscriptions_bundles`, subscriptions_bundles);
      return NextResponse.json(subscriptions_bundles, { status: 200 });
    } catch (e) {
      return NextResponse.json(
        { error: true, message: JSON.stringify(e) },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { error: true, message: `type not defined!` },
      { status: 500 }
    );
  }
}
