"use client";

import { createClient } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import BagSearch from "./bag_search";

const supabase_shuini = createClient(
  "https://ltvavdcgdrfqhlfpgkks.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dmF2ZGNnZHJmcWhsZnBna2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA1NzEwMjUsImV4cCI6MjAwNjE0NzAyNX0.nAuA5lILpr3giK0fiurM0DprdD1JAf4xgam0laMGfRU"
);

type ProductionData = {
  team: string;
  sortis32: number;
  tonnage32: number;
  sortis42: number;
  tonnage42: number;
  dechires32: number;
  dechires42: number;
  utilises32: number;
  utilises42: number;
  date_time: string;
  restants32: number;
  restants42: number;
};

export default function Page() {
  const [name, setName] = useState<string | undefined>(undefined);
  const [errorStockOverflow, seterrorStockOverflow] = useState<boolean>(false);
  const [bags, setBags] = useState<number>(0);
  const [bagsInBao, setBagsInBao] = useState<number>(300);
  const [bagType, setBagType] = useState<"s32" | "s42">("s32");
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [team, setTeam] = useState<string | null>(null);
  const [stock_cont, set_stock_cont] = useState<{
    s32: number;
    s42: number;
  }>({
    s32: 0,
    s42: 0,
  });
  const [stock_prod, set_stock_prod] = useState<{
    s32: number;
    s42: number;
  }>({
    s32: 0,
    s42: 0,
  });
  const [data, setData] = useState<ProductionData>({
    team: "A",
    sortis32: 0,
    tonnage32: 0,
    sortis42: 0,
    tonnage42: 0,
    dechires32: 0,
    dechires42: 0,
    utilises32: 0,
    utilises42: 0,
    date_time: "2025-05-27T19:18",
    restants32: 0,
    restants42: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    let { data, error } = await supabase_shuini
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
      set_stock_cont({ s32: data.s32, s42: data.s42 });
      setLoading(false);
    }

    setLoading(true);
    let { data: data1, error: error1 } = await supabase_shuini
      .from("sacs_stock_prod")
      .select("*")
      .order("created_at", { ascending: false }) // or 'id'
      .limit(1)
      .single();

    console.log("data cont", data);

    if (error1) {
      console.error("Error fetching data:", error1);
      setLoading(false);
    } else {
      set_stock_prod({ s32: data.s32, s42: data.s42 });
      setLoading(false);
    }
  }

  useEffect(() => {
    let total = 0;

    seterrorStockOverflow(false);

    if (bagType === "s32") {
      if (bags * bagsInBao > stock_cont.s32) {
        seterrorStockOverflow(true);
      }
    }

    if (bagType === "s42") {
      if (bags * bagsInBao > stock_cont.s42) {
        seterrorStockOverflow(true);
      }
    }

    // if (!errorStockOverflow) {
    total = bags * bagsInBao;
    //  }
    setTotal(total);

    //console.log("Old data:", data, name);
    const nd: ProductionData = { ...data };

    if (bagType === "s32") {
      nd.sortis32 = total;
    }

    if (bagType === "s42") {
      nd.sortis42 = total;
    }

    nd.team = team ?? "A";
    nd.date_time = new Date().toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm format

    console.log("New data:", nd, "Name:", name);
  }, [bags, bagsInBao, bagType, stock_cont, team, name]);

  async function onAddTrans(data: ProductionData) {
    const pr_trans_prod = supabase_shuini.from("sacs_prod").insert(data);

    const new_stock_prod = { s32: data.restants32, s42: data.restants42 };
    set_stock_prod(new_stock_prod);
    const pr_stock_prod = supabase_shuini
      .from("sacs_stock_prod")
      .insert(new_stock_prod);

    // console.log("data", data);
    // console.log("stock_cont", stock_cont);

    const { sortis32, sortis42 } = data;
    const { s32, s42 } = stock_cont;

    const new_stock_container = { s32: s32 - sortis32, s42: s42 - sortis42 };

    console.log("news", new_stock_container);

    set_stock_cont(new_stock_container);

    const pr_stock_cont = supabase_shuini
      .from("sacs_stock_cont")
      .insert(new_stock_container);

    setLoading(true);
    const res = await Promise.all([
      pr_trans_prod,
      pr_stock_prod,
      pr_stock_cont,
    ]);
    const success = res.every((el) => el === null);

    console.log("res prod insert", res);

    setLoading(false);

    if (success) {
      alert("Data saved!");
      console.log(res);
    } else {
      //console.log(res);
      alert(`Error saving data! \n ${JSON.stringify(res)}`);
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
            <div>s32: {stock_cont.s32}</div>
            <div>s42: {stock_cont.s42}</div>
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
                  onAddTrans(data);
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
