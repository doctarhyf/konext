import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import { TABLE_NAMES } from "@/db/supabase";
import { User } from "@/db/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const creds = await req.json();
  const { phone, pin } = creds;

  if (creds) {
    const userData = await SB.loadSingleItemByPhoneAndPin(phone, pin);

    if (userData === null) {
      const res = (await (SB.loadItem(
        TABLE_NAMES.KOOP_USERS,
        "phone",
        phone
      ) as unknown)) as User;

      if (res && res.id) {
        return NextResponse.json(
          { error: true, message: "PIN INCORRECT" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(userData, { status: 200 });
  }

  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
