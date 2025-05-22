"use client";

import { useSearchParams } from "next/navigation";

export default function Bags() {
  const users: Record<string, string> = {
    TYY: "谭义勇",
    ZF: "赵峰",
    WG: "王刚",
    ZYB: "张玉波",
    WZR: "武子瑞",
    XH: "徐华",
    LG: "李刚",
  };

  const searchParams = useSearchParams();
  const id = searchParams.get("id")?.toUpperCase(); // e.g. "ZYB"

  const name = id ? users[id] : undefined;

  if (!name) {
    return <div className="main text-black">User not found</div>;
  }
  return <div className="main text-black">Hello {name ?? "Guest"}!</div>;
}
