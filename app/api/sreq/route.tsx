import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import supabase, { TABLE_NAMES } from "@/db/supabase";
import { ServiceRequest, User } from "@/db/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams;
  const user_id = params.get("user_id");
  let serviceRequestArray: ServiceRequest[] = [];

  //console.error("user id => ", user_id);

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

    const users_ids: number[] = [];

    const readingAll = user_id === null;
    const users_by_id: Record<number, User> = {};
    const final_items: ServiceRequest[] = [];
    if (readingAll) {
      sreqs.forEach((sr, i) => {
        const { user_id } = sr;
        if (!users_ids.includes(user_id)) users_ids.push(user_id);
      });

      const usersPromises: any = [];
      if (users_ids.length > 0) {
        users_ids.forEach((uid, i) => {
          usersPromises.push(SB.loadItem(TABLE_NAMES.KOOP_USERS, "id", uid));
        });
      }

      const users = await Promise.all(usersPromises);

      users.forEach((user, i) => {
        users_by_id[user.id] = user;
      });

      //only save sreqs that have a valid user
      //sreqs.map((sr, i) => (sr.user_data = users_by_id[sr.user_id]));
      sreqs.forEach((sr, i) => {
        const user_data = users_by_id[sr.user_id];

        if (user_data) {
          serviceRequestArray.push({ ...sr, user_data: user_data });
        }
      });
    }

    return NextResponse.json(serviceRequestArray, { status: 200 });
  } catch (e) {
    NextResponse.json(
      { error: true, message: "Internal server error : " + JSON.stringify(e) },
      { status: 500 }
    );
  }
}
