import supabase, { TABLE_NAMES } from "@/db/supabase";
import { error } from "console";

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

  console.error(`Load from ${tableName} where ${rowName} = ${rowVal}`);

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

export async function loadMessages(user_id, page = 1, count = 20) {
  // http://localhost:3000/api/messages/?user_id=47&page=0&count=10

  if (0 === parseInt(page)) page = 1;

  const range_from = count * page - count;
  const range_to = count * page;

  let { data, error } = await supabase
    .from(TABLE_NAMES.KOOP_MESSAGES)
    .select("*")
    .range(range_from, range_to) // count exampl 20
    .order("created_at", { ascending: true });
  console.log(
    ` Loading messages from ${TABLE_NAMES.KOOP_MESSAGES} where from_id = ${user_id} or to_id = ${user_id}, range_from = ${range_from}, range_to = ${range_to} `
  );

  data = data.filter((m, i) => m.from_id === user_id || m.to_id === user_id);

  if (error) return error;
  return data;
}

// Define a function to load a single item based on phone number and pin
export async function loadSingleItemByPhoneAndPin(phone, pin) {
  try {
    // Query the 'users' table for a single item where phone = '0980967780' and pin = '0000'
    const { data, error } = await supabase
      .from(TABLE_NAMES.KOOP_USERS)
      .select("*")
      .eq("phone", phone)
      .eq("pin", pin)
      .single();

    if (error) {
      throw error;
    }

    // If data is found, return it
    if (data) {
      return data;
    } else {
      console.log("No data found for the given criteria.");
      return null;
    }
  } catch (error) {
    console.error("Error loading item:", error.message);
    return null;
  }
}

export async function sendMessage(message) {
  try {
    // Perform the insertion
    const { data, error } = await supabase
      .from(TABLE_NAMES.KOOP_MESSAGES)
      .insert([message])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // If data is returned, insertion was successful
    if (data) {
      console.log("Data inserted successfully:", data);
      return data;
    } else {
      console.log("Data insertion failed.");
      return { error: true, ...error };
    }
  } catch (error) {
    console.error("Error inserting data:", error.message);
    return { error: true, ...error };
  }
}

export async function createUser(phone, pin) {
  try {
    // Perform the insertion
    const { data, error } = await supabase
      .from(TABLE_NAMES.KOOP_USERS)
      .insert([{ phone: phone, pin: pin }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // If data is returned, insertion was successful
    if (data) {
      console.log("Data inserted successfully:", data);
      return data;
    } else {
      console.log("Data insertion failed.");
      return null;
    }
  } catch (error) {
    console.error("Error inserting data:", error.message);
    return null;
  }
}

export async function updateUserData(user_id, date_key, new_value) {
  try {
    // Perform the update
    const { data, error } = await supabase
      .from(TABLE_NAMES.KOOP_USERS)
      .update({ [date_key]: new_value })
      .eq("id", user_id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // If data is returned, update was successful
    if (data) {
      console.log("Email updated successfully:", data);
      return data;
    } else {
      console.log("Email update failed.");
      return null;
    }
  } catch (error) {
    console.error("Error updating email:", error.message);
    return null;
  }
}

export async function insertItem(tableName, data) {
  const res = await supabase.from(tableName).insert([data]).select();

  if (res.error) return error;

  return res.data;
}

export async function removeItem(tableName, itemdata) {
  //const { data, error } = await supabase.from(tableName).delete().eq(itemdata);
  let query = supabase.from(tableName).delete();

  Object.keys(itemdata).forEach((key) => {
    query = query.eq(key, itemdata[key]);
  });

  const { data, error } = await query.single();

  if (error) {
    console.error("Error deleting item:", error.message);
    return error;
  }

  console.log("Item deleted successfully:", data);
  return data;
}

export async function updateItem(tableName, id, updateData) {
  const { data, error } = await supabase
    .from(tableName)
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating data:", error.message);
    return error;
  } else {
    console.warn("Update successful! => ", data);
    return data;
  }
}

export async function loadItemWithCondition(tableName, conditionObject) {
  let query = supabase.from(tableName).select("*");

  // Iterate over the keys of conditionObject and chain .eq() conditions
  Object.keys(conditionObject).forEach((key) => {
    query = query.eq(key, conditionObject[key]);
  });

  const { data, error } = await query.single();

  if (error) {
    console.error("Error fetching data:", error.message);
    return error;
  }

  console.log("data => ", data);
  return data;
}
