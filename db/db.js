import supabase from "@/db/supabase";
export async function loadAllComments(item_id) {
  let { data, error } = await supabase
    .from("koop_comments")
    .select("*")
    .eq("item_id", item_id);

  if (error) return error;
  return data;
}

export async function loadItem(tableName, rowName, rowVal) {
  let { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq(rowName, rowVal);

  if (error) return error;
  return data[0];
}
