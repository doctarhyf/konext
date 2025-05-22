"use client";

import { createClient } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const supabase_shuini = createClient(
  "https://ltvavdcgdrfqhlfpgkks.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dmF2ZGNnZHJmcWhsZnBna2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA1NzEwMjUsImV4cCI6MjAwNjE0NzAyNX0.nAuA5lILpr3giK0fiurM0DprdD1JAf4xgam0laMGfRU"
);

export { supabase_shuini };

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
    return (
      <div className="main h-screen text-black">
        <h1 className="text-2xl">没有找到该用户</h1>{" "}
      </div>
    );
  }

  const [bags, setBags] = useState<number>(0);
  const [bagType, setBagType] = useState<number>(300);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [team, setTeam] = useState<string | null>(null);

  useEffect(() => {
    setTotal(bagType * bags);
  }, [bags, bagType]);

  async function onSave(name: string, total: number) {
    setLoading(true);

    const data = {
      fuzeren: name,
      daizi: total,
      team: "A",
      date_time: "2025.05.22 20:30",
    };
    try {
      const { data, error } = await supabase_shuini
        .from("sacs_stock_cont")
        .select("*")
        .order("created_at", { ascending: false }) // or 'id'
        .limit(1)
        .single();

      console.log("data", data);
      alert("data :" + data);

      const res = await supabase_shuini
        .from("sacs_sortie_cont")
        .insert([data])
        .select();

      alert(JSON.stringify(res));
      // window.location.href = "https://gongren.vercel.app";
      return res.error ? { error: true, ...res.error } : res.data;
    } catch (e) {
      return e;
    }

    setLoading(false);
  }

  return (
    <div className="main h-screen text-black">
      <div>{name}先生你好!</div>
      <div>您想令几包袋子</div>
      <div>包</div>
      <div>
        <input
          type="number"
          value={bags}
          onChange={(e) => setBags(parseInt(e.target.value))}
        />
      </div>
      <div>多少袋子的包</div>
      <div>
        <select
          value={bagType}
          onChange={(e) => setBagType(parseInt(e.target.value))}
          title="bao"
        >
          {[300, 500].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div>班组</div>
      <div>
        <select
          value={team ?? ""}
          onChange={(e) => setTeam(e.target.value)}
          title="bao"
        >
          {["A", "B", "C"].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div>总和</div>
      <div className=" text-3xl ">{total} 袋</div>

      <button onClick={(e) => onSave(name, total)}>CONFIRM</button>
    </div>
  );
}
