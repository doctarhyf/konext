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

    const groupedMessages = await messagesData.reduce(async (acc: any, obj) => {
      const contact_id =
        obj.from_id === parseInt(user_id) ? obj.to_id : obj.from_id;
      if (!acc[contact_id]) {
        acc[contact_id] = [];
      }
      const contact_data = await SB.loadItem(
        TABLE_NAMES.KOOP_USERS,
        "id",
        contact_id
      );

      const type = obj.from_id === parseInt(user_id) ? "out" : "in";
      const message_obj = { ...obj, type: type, contact_data: contact_data };

      console.error(message_obj);

      if (contact_data.code === undefined) {
        acc[contact_id].push(message_obj);
      } else {
        console.error(
          `Skipping adding message cuz user with id : ${contact_id} could not be found!`
        );
      }

      return acc;
    }, {});

    console.error("groupedMessages => ", groupedMessages);

    return NextResponse.json(groupedMessages, { status: 200 });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
