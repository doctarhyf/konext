import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import supabase, { TABLE_NAMES } from "@/db/supabase";
import { Comment, User } from "@/db/types";
import { timeAgo } from "@/app/utils/funcs";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const item_id: number = params.get("item_id") as unknown as number;
  const item_type: string = params.get("item_type") as unknown as string;
  const posted_by_ids: number[] = [];
  const finalComments: any[] = [];

  if (!item_id || !item_type) {
    return NextResponse.json(
      { error: true, message: `item_id and item_type must be set!` },
      { status: 500 }
    );
  }

  const comments = (await SB.loadItemComments(item_id, item_type)) as Comment[];
  console.log(`Comments loaded : \n ${comments}`);

  if (comments.length > 0) {
    comments.forEach((cmt, i) => {
      if (!posted_by_ids.includes(cmt.posted_by_id)) {
        posted_by_ids.push(cmt.posted_by_id);
      }
    });

    const posted_by_promises: Promise<User>[] = [];
    posted_by_ids.forEach((id, i) =>
      posted_by_promises.push(SB.loadItem(TABLE_NAMES.KOOP_USERS, "id", id))
    );

    const users = await Promise.all(posted_by_promises);
    console.log(`Loaded users \n ${JSON.stringify(users)}`);

    if (users.length > 0) {
      const users_by_id: any[] = [];
      users.forEach((u, i) => {
        if (!users_by_id[u.id]) users_by_id[u.id] = [];

        users_by_id[u.id] = u;
      });

      comments.forEach((cmt, i) => {
        const finalComment: any = { ...cmt };

        finalComment.timeAgo = timeAgo(new Date(cmt.created_at));

        finalComments.push({
          ...finalComment,
          user_data: users_by_id[cmt.posted_by_id],
        });
      });
    }
  }

  console.error(`Final comments => \n ${JSON.stringify(finalComments)}`);

  return NextResponse.json(finalComments, { status: 200 });

  //: NextRequest) {
  /* try {
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

    const commentsData = await SB.loadAllItemsWithCondition(TABLE_NAMES.KOOP_COMMENTS, 'item_id')

    const messagesGroupedByID: any = {};
    const contacts_ids: number[] = [];
    const contactPromises: any[] = [];

    commentsData.forEach((msg, i) => {
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
  } */
}

/*

{
    "item_id": 26,
    "posted_by_id": 66,
    "comment": "I’m not going back in the house yet 🔥 😎 🦫 ",
    "item_type":"sreq"
}
*/
