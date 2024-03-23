import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import supabase, { TABLE_NAMES } from "@/db/supabase";
import { User } from "@/db/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ids = await req.json();
  const { user_id, item_id } = ids;

  if (ids) {
    const { data, error } = await supabase
      .from(TABLE_NAMES.KOOP_ITEM_VIEWS_COUNT)
      .select("*")
      .eq("item_id", item_id)
      .single();

    if (error) {
      const res = await SB.insertItem(TABLE_NAMES.KOOP_ITEM_VIEWS_COUNT, {
        ...ids,
        views: 1,
      });

      return NextResponse.json(res, { status: 200 });
    } else {
      const { id, views, item_id, user_id } = data;
      const newdata = { item_id: item_id, user_id: user_id, views: views + 1 };
      let res = await SB.updateItem(
        TABLE_NAMES.KOOP_ITEM_VIEWS_COUNT,
        id,
        newdata
      );

      if (res && res.id) {
        const item = await SB.loadItem(TABLE_NAMES.KOOP_ITEMS, "id", item_id);

        if (item && item.id) {
          const { views } = item;
          res = await SB.updateItem(TABLE_NAMES.KOOP_ITEMS, item_id, {
            views: newdata.views,
          });
        }
      }

      return NextResponse.json(res, { status: 200 });
    }
  }

  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
