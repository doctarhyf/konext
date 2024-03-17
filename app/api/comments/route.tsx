import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";

type Comment = {
  id: number; // Changed Number to number
  created_at: Date;
  comment: string; // Changed String to string
  item_id: number; // Changed Number to number
  posted_by_id: number; // Changed Number to number
  posted_by_display_name: string; // Changed String to string
  posted_by_profile: string; // Changed String to string
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

    const loadedComments = await SB.loadAllComments(id);
    const comments: Comment[] = [];

    if (Array.isArray(loadedComments)) {
      for (const curComment of loadedComments) {
        const { posted_by_id } = curComment;
        const poster = await SB.loadItem("koop_users", "id", posted_by_id);

        if (poster) {
          const com: Comment = {
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
    }

    console.log(comments);
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
