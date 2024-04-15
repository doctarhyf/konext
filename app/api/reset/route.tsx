import * as SB from "@/db/db";
import { TABLE_NAMES } from "@/db/supabase";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const pwd = req.nextUrl.searchParams.get("pwd");

  if (pwd === "1505") {
    const promises = [
      SB.deleteItem(TABLE_NAMES.KOOP_USERS),
      SB.deleteItem(TABLE_NAMES.KOOP_SERVICE_REQUEST),
      SB.deleteItem(TABLE_NAMES.KOOP_MESSAGES),
      SB.deleteItem(TABLE_NAMES.KOOP_ITEM_VIEWS_COUNT),
      SB.deleteItem(TABLE_NAMES.KOOP_ITEMS_LIKES),
      SB.deleteItem(TABLE_NAMES.KOOP_ITEMS),
      SB.deleteItem(TABLE_NAMES.KOOP_CONTACT_US),
      SB.deleteItem(TABLE_NAMES.KOOP_COMMENTS),
    ];
    const res = await Promise.all(promises);

    //const r = await SB.removeAllFilesAndDirectories();

    console.warn("res del tables => ", res);
    // console.warn("res del files => ", r);

    return NextResponse.json("Database reset success!", { status: 200 });
  }

  return NextResponse.json("Error reseting databse, check pwd!", {
    status: 200,
  });
}
