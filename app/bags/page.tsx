"use client";

import { createClient } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import BagSearch from "./bag_search";

const supabase_shuini = createClient(
  "https://ltvavdcgdrfqhlfpgkks.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dmF2ZGNnZHJmcWhsZnBna2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA1NzEwMjUsImV4cCI6MjAwNjE0NzAyNX0.nAuA5lILpr3giK0fiurM0DprdD1JAf4xgam0laMGfRU"
);

export default function Page() {
  const [name, setName] = useState<string | undefined>(undefined);
  const [errorStockOverflow, seterrorStockOverflow] = useState<boolean>(false);
  const [bags, setBags] = useState<number>(0);
  const [bagsInBao, setBagsInBao] = useState<number>(300);
  const [bagType, setBagType] = useState<"s32" | "s42">("s32");
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [team, setTeam] = useState<string | null>(null);
  const [containerStock, setContainerStock] = useState<{
    s32: number;
    s42: number;
  }>({
    s32: 0,
    s42: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data, error } = await supabase_shuini
      .from("sacs_stock_cont")
      .select("*")
      .order("created_at", { ascending: false }) // or 'id'
      .limit(1)
      .single();

    console.log("data cont", data);

    if (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    } else {
      setContainerStock({ s32: data.s32, s42: data.s42 });
      setLoading(false);
    }
  }

  useEffect(() => {
    let total = 0;

    seterrorStockOverflow(false);

    if (bagType === "s32") {
      if (bags * bagsInBao > containerStock.s32) {
        seterrorStockOverflow(true);
      }
    }

    if (bagType === "s42") {
      if (bags * bagsInBao > containerStock.s42) {
        seterrorStockOverflow(true);
      }
    }

    // if (!errorStockOverflow) {
    total = bags * bagsInBao;
    //  }
    setTotal(total);
  }, [bags, bagsInBao, bagType, containerStock, team]);

  async function onSave(
    fuzeren: string,
    daizi: number,
    team: string,
    date_time: string
  ) {
    setLoading(true);

    const data = {
      fuzeren: fuzeren,
      daizi: daizi,
      team: team,
      date_time: date_time,
    };
    try {
      const res = await supabase_shuini
        .from("sacs_sortie_cont")
        .insert([data])
        .select();

      const newStock32 =
        bagType === "s32" ? containerStock.s32 - total : containerStock.s32;
      const newStock42 =
        bagType === "s42" ? containerStock.s42 - total : containerStock.s42;

      const newStock = { s32: newStock32, s42: newStock42 };
      setContainerStock(newStock);

      const res2 = await supabase_shuini
        .from("sacs_stock_cont")
        .insert([newStock])
        .select();

      alert(JSON.stringify(res));
      setLoading(false);
      window.location.href = "https://gongren.vercel.app";
      return res.error ? { error: true, ...res.error } : res.data;
    } catch (e) {
      setLoading(false);
      return e;
    }
  }

  function onNameLoad(name: string | undefined) {
    setName(name);
  }

  return (
    <div className="main h-screen text-black w-full bg-gradient-to-tr from-slate-800 to-gray-100 flex flex-col items-center justify-center">
      <Suspense fallback={<p>Loading search...</p>}>
        <BagSearch onNameLoaded={onNameLoad} />
      </Suspense>
      <div className=" shadow-md max-h-min rounded-md m-2 bg-gradient-to-t w-full max-w-80 border  border-gray-300 from-gray-200 to-white flex flex-col  justify-center p-4">
        <div>
          <img src="bt.png" alt="Bag icon" />
        </div>

        <div className=" flex-col md:flex-row flex  justify-between border-b border-slate-500">
          <div>
            <div className=" text-3xl ">{name}</div>
            <div>先生你好!</div>
          </div>

          <div className="  py-2 md:text-end  ">
            <div className=" text-emerald-700 font-bold ">袋子库房</div>
            <div>s32: {containerStock.s32}</div>
            <div>s42: {containerStock.s42}</div>
          </div>
        </div>

        <div>您想领多少袋子</div>
        <div>包</div>
        <div>
          <input
            className="border-2 border-gray-300 rounded-md p-1 w-24 "
            type="number"
            value={bags}
            onChange={(e) => setBags(parseInt(e.target.value))}
          />
        </div>

        <div>包 Type</div>

        <div>
          <select
            value={bagType}
            onChange={(e) => setBagType(e.target.value as "s32" | "s42")}
            title="bao"
            className="border-2 border-gray-300 rounded-md p-1 w-24 "
          >
            {["s32", "s42"].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>多少袋子的包</div>
        <div>
          <select
            value={bagsInBao}
            onChange={(e) => setBagsInBao(parseInt(e.target.value))}
            title="bao"
            className="border-2 border-gray-300 rounded-md p-1 w-24 "
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
            className="border-2 border-gray-300 rounded-md p-1 w-24 "
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

        {errorStockOverflow ? (
          <div className=" bg-red-900 text-red-200 p-2 shadow-sm  ">
            The number of bags to be delivered cant be superior to the available
            stock
          </div>
        ) : (
          !loading && (
            <button
              className=" mt-4 p-2 bg-gradient-to-tr hover:from-blue-900 hover:to-purple-900 from-blue-950 to-purple-900 text-white hover:text-purple-200 rounded-md shadow-sm  "
              onClick={(e) => {
                if (window.confirm("Are you sure you want to confirm this?")) {
                  onSave(name ?? "", total, team ?? "", "2025.05.22");
                }
              }}
            >
              CONFIRM
            </button>
          )
        )}

        {loading && <div>Loading...</div>}
      </div>
    </div>
  );
}
