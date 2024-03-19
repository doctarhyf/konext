import supabase from "@/db/supabase";

export async function loadAllComments(item_id) {
  let { data, error } = await supabase
    .from("koop_comments")
    .select("*")
    .eq("item_id", item_id)
    .order("created_at", { ascending: false });

  if (error) return error;
  return data;
}

export async function loadItem(tableName, rowName, rowVal) {
  let { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq(rowName, rowVal)
    .single();

  if (error) return error;
  return data;
}

export async function loadAllItems(tableName, count = 10) {
  let { data, error } = await supabase
    .from(tableName)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return error;
  return data;
}

export async function loadAllItemsWithCondition(tableName, rowName, rowVal) {
  let { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq(rowName, rowVal)
    .order("created_at", { ascending: false });

  console.error(
    `Loading * from ${tableName}, where ${rowName} == ${rowVal}\nres => `,
    data,
    error
  );

  if (error) return error;
  return data;
}
