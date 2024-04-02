import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import supabase, { TABLE_NAMES } from "@/db/supabase";
import { ServiceRequest } from "@/db/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams;
  const user_id = params.get("user_id");
  let sreqsArray: ServiceRequest[] = [];

  console.error("user id => ", user_id);

  try {
    let promise = SB.loadAllItems(TABLE_NAMES.KOOP_SERVICE_REQUEST);

    if (user_id) {
      promise = SB.loadAllItemsWithCondition(
        TABLE_NAMES.KOOP_SERVICE_REQUEST,
        "user_id",
        user_id
      );
    }

    const sreqs = (await promise) as ServiceRequest[];

    if ((user_id === null || user_id === undefined) && sreqs) {
      const users_ids: number[] = [];

      sreqs.forEach((it, i) => {
        if (!users_ids.includes(it.user_id)) users_ids.push(it.user_id);
      });

      const promises: any = [];
      if (users_ids.length > 0) {
        users_ids.forEach((uid, i) => {
          promises.push(SB.loadItem(TABLE_NAMES.KOOP_USERS, "id", uid));
        });
      }

      const users = await Promise.all(promises);
      console.error("loaded users => ", users);

      const users_by_id: any = {};
      users.forEach((user, i) => {
        if (!users_by_id[user.id]) {
          users_by_id[user.id] = [];
        }
        users_by_id[user.id] = user;
      });

      sreqs.forEach((sr, i) => {
        const fsreq: ServiceRequest = {
          ...sr,
          user_data: users_by_id[sr.user_id],
        };
        sreqsArray.push(fsreq);
      });
    }

    //sreqsArray = [...sreqs];

    return NextResponse.json(sreqsArray, { status: 200 });
  } catch (e) {
    NextResponse.json(
      { error: true, message: "Internal server error : " + JSON.stringify(e) },
      { status: 500 }
    );
  }
}
