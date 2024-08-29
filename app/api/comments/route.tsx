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

    //posted_by_ids = comments.map((it) => it.posted_by_id)

    const posted_by_promises: Promise<User>[] = [];
    posted_by_ids.forEach((id, i) =>
      posted_by_promises.push(SB.loadItem(TABLE_NAMES.KOOP_USERS, "id", id))
    );

    // posted_by_promises = posted_by_ids.map((it) => SB.loadItem(TABLE_NAMES.KOOP_USERS, "id", id))

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
}
