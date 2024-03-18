import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";

export const dynamic = "force-dynamic";

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
  //shop
  shop_name: string;
  shop_profile: string;
  shop_desc: string;
  shop_email: string;
  shop_whatsapp: string;
  shop_wechat: string;
  shop_tiktok: string;
  shop_facebook: string;
};

export async function GET(req: NextRequest) {
  const loadedKoopItems = await SB.loadAllItems("koop_items");
  const koopItems: KoopItem[] = [];

  if (Array.isArray(loadedKoopItems)) {
    for (const koopItem of loadedKoopItems) {
      const { user_id } = koopItem;
      const user = await SB.loadItem("koop_users", "id", user_id);

      if (user) {
        const {
          display_name,
          profile,
          shop_name,
          shop_profile,
          shop_desc,
          shop_email,
          shop_whatsapp,
          shop_wechat,
          shop_tiktok,
          shop_facebook,
        } = user;
        const finalKoopItem: KoopItem = {
          ...koopItem,
          //user info
          user_display_name: display_name,
          user_profile: profile,
          //shop info

          shop_name: shop_name,
          shop_profile: shop_profile,
          shop_desc: shop_desc,
          shop_email: shop_email,
          shop_whatsapp: shop_whatsapp,
          shop_wechat: shop_wechat,
          shop_tiktok: shop_tiktok,
          shop_facebook: shop_tiktok,
        };
        koopItems.push(finalKoopItem);
      }
    }

    console.log(koopItems);
    return NextResponse.json(koopItems, { status: 200 });
    /* } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } */
  }
}
