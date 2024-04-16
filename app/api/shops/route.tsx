import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import { KoopShop } from "@/db/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const loadedUsers = await SB.loadAllItems("koop_users");
  const koopShops: KoopShop[] = [];

  if (Array.isArray(loadedUsers)) {
    for (const koopUser of loadedUsers) {
      const {
        id,
        profile,
        display_name,
        phone,
        created_at,
        shop_name,
        shop_tags,
        shop_desc,
        shop_profile,
        shop_add,
        shop_email,
        shop_whatsapp,
        shop_wechat,
        shop_tiktok,
        shop_facebook,
        items_count,
        comments_cout,
      } = koopUser;

      const shop: KoopShop = {
        id: id,
        profile: profile,
        display_name: display_name,
        phone: phone,
        shop_id: id,
        created_at: created_at,
        shop_name: shop_name,
        shop_tags: shop_tags,
        shop_desc: shop_desc,
        shop_profile: shop_profile,
        shop_add: shop_add,
        shop_email: shop_email,
        shop_whatsapp: shop_whatsapp,
        shop_wechat: shop_wechat,
        shop_tiktok: shop_tiktok,
        shop_facebook: shop_facebook,
        items_count: items_count,
        comments_count: comments_cout,
      };

      koopShops.push(shop);
    }

    console.log(koopShops);
    return NextResponse.json(koopShops, { status: 200 });
  }
}
