import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import { TABLE_NAMES } from "@/db/supabase";

const NATIVE_NOTIFY_API = "https://app.nativenotify.com/api/notification";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const creds = await req.json();
  const { phone, pin } = creds;

  if (creds) {
    const userData = await SB.createUser(phone, pin);

    console.log("userData => ", userData);

    const pl = {
      appId: 20602,
      appToken: "b4XsCQJJ9vzPICDZTpbPuy",
      title: `Welcome ${userData.display_name}`,
      body: "La famille koop te souhaite le bienvenue😀",
      dateSent: "4-4-2024 8:48PM",
      pushData: { yourProperty: "yourPropertyValue" },
      bigPictureURL: userData.profile,
    };

    const response = await fetch(NATIVE_NOTIFY_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pl), //nouveau design
    });
    console.log(`Native Notify Response : ${response}`);
    return NextResponse.json(userData, { status: 200 });
  }

  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
