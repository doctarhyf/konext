import { deleteItem } from "@/db/db";
import { TABLE_NAMES } from "@/db/supabase";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const pwd = req.nextUrl.searchParams.get("pwd");

  if (pwd === "1505") {
    const promises = [
      deleteItem(TABLE_NAMES.KOOP_USERS),
      deleteItem(TABLE_NAMES.KOOP_SERVICE_REQUEST),
      deleteItem(TABLE_NAMES.KOOP_MESSAGES),
      deleteItem(TABLE_NAMES.KOOP_ITEM_VIEWS_COUNT),
      deleteItem(TABLE_NAMES.KOOP_ITEMS_LIKES),
      deleteItem(TABLE_NAMES.KOOP_ITEMS),
      deleteItem(TABLE_NAMES.KOOP_CONTACT_US),
      deleteItem(TABLE_NAMES.KOOP_COMMENTS),
    ];
    const res = await Promise.all(promises);
    return NextResponse.json("Database reset success!", { status: 200 });
  }

  return NextResponse.json("Error reseting databse, check pwd!", {
    status: 200,
  });
}
