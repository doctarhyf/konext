// components/BagsSearch.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function BagsSearch({
  onNameLoaded,
}: {
  onNameLoaded: (name: string | undefined) => void;
}) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id")?.toUpperCase();

  const users: Record<string, string> = {
    TYY: "谭义勇",
    ZF: "赵峰",
    WG: "王刚",
    ZYB: "张玉波",
    WZR: "武子瑞",
    XH: "徐华",
    LG: "李刚",
  };

  const name = id ? users[id] : undefined;

  useEffect(() => {
    const name = id ? users[id] : undefined;
    onNameLoaded(name);
    console.log("id", id, "name", name); // Pass the query to the parent component
  }, [id]);

  return <div>Search query: {name ?? ""}</div>;
}
