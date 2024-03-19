import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import { TABLE_NAMES } from "@/db/supabase";

export const dynamic = "force-dynamic";

type User = {
  id: number; // Changed Number to number
  created_at: Date;
  phone: string;
  pin: string;
  full_name: string;
  dob: string;
  email: string;
  ville: string;
  display_name: string;
  profile: string;
  shop_name: string;
  shop_tags: string;
  shop_desc: string;
  shop_add: string;
  shop_email: string;
  shop_web: string;
  shop_profile: string;
  shop_likes: number;
  shop_whatsapp: string;
  shop_wechat: string;
  shop_tiktok: string;
  shop_facebook: string;
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

    const loadedUser = await SB.loadItem(TABLE_NAMES.KOOP_USERS, "id", id);
    /* const comments: User[] = [];

    if (Array.isArray(loadedUser)) {
      for (const curComment of loadedUser) {
        const { posted_by_id } = curComment;
        const poster = await SB.loadItem("koop_users", "id", posted_by_id);

        if (poster) {
          const com: User = {
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
    }*/

    console.log(loadedUser);
    return NextResponse.json(loadedUser, { status: 200 });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
