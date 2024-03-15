import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const name = url.searchParams.get("name");

  return NextResponse.json({ text: `Hello ${name || "no name"}` });
}
