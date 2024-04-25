import { NextRequest, NextResponse } from "next/server";
import * as SB from "@/db/db";
import { TABLE_NAMES } from "@/db/supabase";
import { ServiceRequest } from "@/db/types";
import { sendNotification } from "@/app/utils/funcs";

export const dynamic = "force-dynamic";

//api route :POST /sreq/send
export async function POST(req: NextRequest) {
  const sreqData: ServiceRequest = (await req.json()) as ServiceRequest;
  const { user_id, label, desc, images } = sreqData;

  console.log("Sendin serv req data => ", sreqData);

  if (sreqData && label && label.length > 0) {
    const res = (await SB.insertItem(
      TABLE_NAMES.KOOP_SERVICE_REQUEST,
      sreqData
    )) as ServiceRequest[];

    const user = await SB.loadItem(TABLE_NAMES.KOOP_USERS, "id", user_id);
    if (user) {
      const r = await SB.updateUserData(
        user_id,
        "items_count",
        parseInt(user.items_count) + 1
      );
      
      const notres = await sendNotification(
      `New item posted by ${user.display_name}`,
      label,
      JSON.stringify(sreqData)
    );
    console.log(notres);  
    }




    

    return NextResponse.json(res[0], { status: 200 });
  } else {
    return NextResponse.json(
      {
        error: true,
        message: `Internal Server Error, Service Request Data not sent. ${JSON.stringify(
          sreqData
        )}`,
      },
      { status: 500 }
    );
  }
}
