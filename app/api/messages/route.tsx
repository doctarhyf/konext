import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import supabase, { TABLE_NAMES } from "@/db/supabase";
import { Message } from "@/db/types";

export const dynamic = "force-dynamic";

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

    const messagesGroupedByID: any = {};
    const contacts_ids: number[] = [];
    const contactPromises: any[] = [];

    messagesData.forEach((msg, i) => {
      const contact_id =
        parseInt(user_id) === msg.from_id ? msg.to_id : msg.from_id;
      const me = parseInt(user_id) === msg.from_id ? true : false;

      if (!contacts_ids.includes(contact_id)) {
        const p = SB.loadItem(TABLE_NAMES.KOOP_USERS, "id", contact_id);
        contacts_ids.push(contact_id);
        contactPromises.push(p);
      }
      if (!messagesGroupedByID[contact_id])
        messagesGroupedByID[contact_id] = [];

      messagesGroupedByID[contact_id].push({ ...msg, me: me });
    });

    const contacts = await Promise.all(contactPromises);

    const finalMessages: any = {};
    Object.entries(messagesGroupedByID).forEach((messageGroup, groupIndex) => {
      const groupKey: any = messageGroup[0];
      const messagesArray: any = messageGroup[1];

      const current_contact = contacts.filter((it, i) => it.id == groupKey)[0];
      const finalMessageGroup = [current_contact, ...messagesArray];
      finalMessages[groupKey] = finalMessageGroup;
    });

    return NextResponse.json(finalMessages, { status: 200 });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
