import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import supabase, { TABLE_NAMES } from "@/db/supabase";
import { ServiceRequest } from "@/db/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams;
  const user_id = params.get("user_id");
  let sreqsArray: ServiceRequest[] = [];

  //return NextResponse.json({ user_id: user_id }, { status: 200 });

  try {
    let promise = SB.loadAllItems(TABLE_NAMES.KOOP_SERVICE_REQUEST);

    if (user_id) {
      promise = SB.loadAllItemsWithCondition(
        TABLE_NAMES.KOOP_SERVICE_REQUEST,
        "user_id",
        user_id
      );
    }

    const sreqs = (await promise) as ServiceRequest[];

    sreqsArray = [...sreqs];
    return NextResponse.json(sreqsArray, { status: 200 });
  } catch (e) {
    NextResponse.json(
      { error: true, message: "Internal server error : " + JSON.stringify(e) },
      { status: 501 }
    );
  }
}
