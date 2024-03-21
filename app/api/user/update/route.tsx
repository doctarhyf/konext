import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";

import { User, UserDataUpdate } from "@/db/types";
import { error } from "console";

export const dynamic = "force-dynamic";

/*
export interface UserDataUpdate {
  user_id: number;
  data_key: string;
  new_value: string;
}
*/

export async function POST(req: NextRequest) {
  let errorMessage = null;
  try {
    const body = (await req.json()) as UserDataUpdate;
    const keys = Object.keys(body);

    if (keys.length !== 3) {
      errorMessage = "Keys count length not equal to 3!";
      throw error(errorMessage);
    }

    if (
      !(
        keys.includes("user_id") &&
        keys.includes("data_key") &&
        keys.includes("new_value")
      )
    ) {
      errorMessage = "Keys not found!";
      throw error(errorMessage);
    }

    const { user_id, data_key, new_value } = body;
    const res = await SB.updateUserData(user_id, data_key, new_value);

    console.log("SB.updateUserData => ", res);
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: errorMessage },
      { status: 500 }
    );
  }
}
