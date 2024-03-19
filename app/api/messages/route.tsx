import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import { TABLE_NAMES } from "@/db/supabase";

type Message = {
  id: number; // Changed Number to number
  created_at: Date;
  from_id: number;
  to_id: number;
  message: string;
};

export async function GET(req: NextRequest) {
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
      id
    );
    const outboxMessages = await SB.loadAllItemsWithCondition(
      TABLE_NAMES.KOOP_MSG_OUTBOX,
      "from_id",
      id
    );
    const messages = { inbox: inboxMessages, outbox: outboxMessages };

    /* if (Array.isArray(loadedMessages)) {
      for (const curComment of loadedMessages) {
        const { posted_by_id } = curComment;
        const poster = await SB.loadItem("koop_users", "id", posted_by_id);

        if (poster) {
          const com: Message = {
            id: curComment.id,
            created_at: curComment.created_at,
            comment: curComment.comment,
            item_id: curComment.item_id,
            posted_by_id: poster.id,
            posted_by_display_name: poster.display_name,
            posted_by_profile: poster.profile,
          };
          comments.push(com);
        }
      }
    } */

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
