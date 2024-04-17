import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import supabase, { TABLE_NAMES } from "@/db/supabase";
import { ServiceRequest, User } from "@/db/types";
import { timeAgo } from "@/app/utils/funcs";
import { error } from "console";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams;
  const type = params.get("type");

  if (type && type !== "") {
    try {
      const subscriptions_bundles = await SB.loadAllItemsWithCondition(
        TABLE_NAMES.KOOP_SUBSCRIPTIONS_BUNDLES,
        "type",
        type
      );

      console.log(`subscriptions_bundles`, subscriptions_bundles);
      return NextResponse.json(subscriptions_bundles, { status: 200 });
    } catch (e) {
      return NextResponse.json(
        { error: true, message: JSON.stringify(e) },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { error: true, message: `type not defined!` },
      { status: 500 }
    );
  }

  /* const params = new URL(req.url).searchParams;
  const user_id = params.get("user_id");
  const finalSReqsArray: ServiceRequest[] = [];

  //console.error("user id => ", user_id);

  try {
    const users_ids: number[] = [];
    const users_by_id: Record<number, User> = {};
    const readingAll = user_id === null;
    const usersPromises: any = [];

    let promise = readingAll
      ? SB.loadAllItems(TABLE_NAMES.KOOP_SERVICE_REQUEST)
      : SB.loadAllItemsWithCondition(
          TABLE_NAMES.KOOP_SERVICE_REQUEST,
          "user_id",
          user_id
        );

    const rawServiceRequests = (await promise) as ServiceRequest[];

    //get users ids
    rawServiceRequests.forEach((sreq, i) => {
      const { user_id } = sreq;
      if (!users_ids.includes(user_id)) users_ids.push(user_id);
    });

    // setup users load promises
    if (users_ids.length > 0) {
      users_ids.forEach((uid, i) => {
        usersPromises.push(SB.loadItem(TABLE_NAMES.KOOP_USERS, "id", uid));
      });
    }

    const users = await Promise.all(usersPromises);

    //sort users by user_id
    users.forEach((user, i) => {
      users_by_id[user.id] = user;
    });

    //only save sreqs that have a valid user
    //sreqs.map((sr, i) => (sr.user_data = users_by_id[sr.user_id]));
    rawServiceRequests.forEach((sr, i) => {
      const user_data = users_by_id[sr.user_id];

      if (user_data) {
        sr.timeAgo = timeAgo(new Date(sr.created_at));
        finalSReqsArray.push({ ...sr, user_data: user_data });
      }
    });

    return NextResponse.json(finalSReqsArray, { status: 200 });
  } catch (e) {
    NextResponse.json(
      { error: true, message: "Internal server error : " + JSON.stringify(e) },
      { status: 500 }
    );
  } */
}
