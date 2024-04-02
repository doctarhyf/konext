import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import { TABLE_NAMES } from "@/db/supabase";
import { ServiceRequest } from "@/db/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const sreqData: ServiceRequest = (await req.json()) as ServiceRequest;
  const { user_id, label, desc, images } = sreqData;

  console.log("Sendin serv req data => ", sreqData);

  if (sreqData && label && label.length > 0) {
    const res = await SB.insertItem(TABLE_NAMES.KOOP_SERVICE_REQUEST, sreqData);

    console.log("service req save result => ", res);
    return NextResponse.json(res, { status: 200 });
  } else {
    return NextResponse.json(
      {
        error: true,
        message: "Internal Server Error, Service Request Data not sent",
      },
      { status: 500 }
    );
  }
}
