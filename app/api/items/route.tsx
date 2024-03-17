import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import { NextApiResponse } from "next";

type KoopItem = {
  id: number; // Changed Number to number
  created_at: Date;
  user_id: number;
  name: string;
  desc: string;
  link: string;
  code: string;
  active: boolean;
  photos: string[];
  views: number;
  likes: number;
  long: number;
  category: string;
  type: string;
  //user info
  user_display_name: string;
  user_profile: string;
  shop_name: string;
  shop_profile: string;
};

export async function GET(req: NextRequest) {
  // try {
  //const url = new URL(req.url);
  //const id = url.searchParams.get("id");

  /* if (!id) {
      return NextResponse.json(
        { error: "ID parameter is missing" },
        { status: 400 }
      );
    } */

  const loadedKoopItems = await SB.loadAllItems("koop_items");
  const koopItems: KoopItem[] = [];

  if (Array.isArray(loadedKoopItems)) {
    for (const koopItem of loadedKoopItems) {
      const { user_id } = koopItem;
      const user = await SB.loadItem("koop_users", "id", user_id);

      if (user) {
        const { display_name, profile, shop_name, shop_profile } = user;
        const finalKoopItem: KoopItem = {
          ...koopItem,
          user_display_name: display_name,
          user_profile: profile,
          shop_name: shop_name,
          shop_profile: shop_profile,
        };
        koopItems.push(finalKoopItem);
      }
    }

    console.log(koopItems);
    // response.headers.set('Cache-Control', 'no-store');
    const res = NextResponse.json(koopItems, { status: 200 });
    res.headers.set("Cache-Control", "no-store");
    return res;
    /* } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } */
  }
}
