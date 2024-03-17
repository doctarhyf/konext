import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";

type KoopShop = {
  id: number; // Changed Number to number
  created_at: Date;
  shop_name: string;
  shop_tags: string;
  shop_desc: string;
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

  const loadedUsers = await SB.loadAllItems("koop_users");
  const koopShops: KoopShop[] = [];

  if (Array.isArray(loadedUsers)) {
    for (const koopUser of loadedUsers) {
      const { id, created_at, shop_name, shop_tags, shop_desc, shop_profile } =
        koopUser;

      const shop: KoopShop = {
        id: id,
        created_at: created_at,
        shop_name: shop_name,
        shop_tags: shop_tags,
        shop_desc: shop_desc,
        shop_profile: shop_profile,
      };

      koopShops.push(shop);
    }

    console.log(koopShops);
    return NextResponse.json(koopShops, { status: 200 });
  }
}
