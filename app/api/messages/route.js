import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import supabase, { TABLE_NAMES } from "@/db/supabase";

export const dynamic = "force-dynamic";

/* interface Message {
  id: number;
  created_at: Date;
  from_id: number;
  to_id: number;
  message: string;
} */

export async function GET(req) {
  //: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID parameter is missing" },
        { status: 400 }
      );
    }

    const inboxMessages = await SB.loadAllItemsWithCondition(
      TABLE_NAMES.KOOP_MSG_INBOX,
      "to_id",
      parseInt(id)
    );

    const inbox = [];

    for (const inboxmsg of inboxMessages) {
      /*
      id: 6,
  created_at: '2024-03-19T18:15:27.559505+00:00',
  message: '',
  from_id: 47,
  to_id: 48,
  read: false
      */
      const { from_id } = inboxmsg;

      const from_user = await SB.loadItem(
        TABLE_NAMES.KOOP_USERS,
        "id",
        from_id
      );
      inbox.push({ ...inboxmsg, from_user: from_user });
    }

    const outboxMessages = await SB.loadAllItemsWithCondition(
      TABLE_NAMES.KOOP_MSG_OUTBOX,
      "from_id",
      parseInt(id)
    );

    const outbox = [];

    for (const outboxmsg of outboxMessages) {
      /*
      id: 6,
  created_at: '2024-03-19T18:15:27.559505+00:00',
  message: '',
  from_id: 47,
  to_id: 48,
  read: false
      */
      const { to_id } = outboxmsg;

      const to_user = await SB.loadItem(TABLE_NAMES.KOOP_USERS, "id", to_id);
      outbox.push({ ...inboxmsg, to_user: to_user });
    }

    const messages = { inbox: inbox, outbox: outbox };

    console.log(messages);
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
