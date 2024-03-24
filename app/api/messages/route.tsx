import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import supabase, { TABLE_NAMES } from "@/db/supabase";
import { Message } from "@/db/types";

export const dynamic = "force-dynamic";

/* interface Message {
  id: number;
  created_at: Date;
  from_id: number;
  to_id: number;
  message: string;
} */

export async function GET(req: NextRequest) {
  //: NextRequest) {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");
    const page = url.searchParams.get("page");
    const count = url.searchParams.get("count");

    if (!user_id || !page || !count) {
      return NextResponse.json(
        {
          error: true,
          message:
            "Parameters are missing, make sure to provide user_id, page and count",
        },
        { status: 400 }
      );
    }

    const messagesData = (await SB.loadMessages(
      parseInt(user_id),
      parseInt(page),
      parseInt(count)
    )) as Message[];

    /* const messages = [];

    for (const msg of messagesData) {
      const { from_id, to_id } = msg;

      const from_user = await SB.loadItem(
        TABLE_NAMES.KOOP_USERS,
        "id",
        from_id
      );

      if (from_user.code === undefined) {
        messages.push({ ...msg, from_user: from_user });
      }

       const to_user = await SB.loadItem(
         TABLE_NAMES.KOOP_USERS,
         "id",
         from_id
       );

       if (to_user.code === undefined) {
         messages.push({ ...msg, to_user: from_user });
       }

    } */

    return NextResponse.json(messagesData, { status: 200 });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
