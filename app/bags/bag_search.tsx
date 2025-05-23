// components/BagsSearch.tsx
"use client";

import { useSearchParams } from "next/navigation";

export default function BagsSearch() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  return <div>Search query: {query}</div>;
}
