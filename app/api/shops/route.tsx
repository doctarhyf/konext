import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";

export const dynamic = "force-dynamic";

type KoopShop = {
  id: number; // Changed Number to number
  created_at: Date;
  shop_id: number;
  shop_name: string;
  shop_tags: string;
  shop_desc: string;
  shop_profile: string;

  shop_add: string;

  shop_email: string;
  shop_whatsapp: string;
  shop_wechat: string;
  shop_tiktok: string;
  shop_facebook: string;
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

  const loadedUsers = await SB.loadAllItems("koop_users");
  const koopShops: KoopShop[] = [];

  if (Array.isArray(loadedUsers)) {
    for (const koopUser of loadedUsers) {
      const {
        id,
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
      } = koopUser;

      const shop: KoopShop = {
        id: id,
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
      };

      koopShops.push(shop);
    }

    console.log(koopShops);
    return NextResponse.json(koopShops, { status: 200 });
  }
}
