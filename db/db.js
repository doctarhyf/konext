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

export async function loadItemComments(item_id, item_type) {
  let { data, error } = await supabase
    .from(TABLE_NAMES.KOOP_COMMENTS)
    .select("*")
    .eq("item_id", item_id)
    .eq("item_type", item_type)
    .order("created_at", { ascending: false });

  if (error) return error;
  return data;
}

export async function countItemComments(item_id, item_type) {
  let { count, error } = await supabase
    .from(TABLE_NAMES.KOOP_COMMENTS)
    .select("*", { count: "exact" })
    .eq("item_id", item_id)
    .eq("item_type", item_type);
  //.order("created_at", { ascending: false });

  if (error) return error;
  return count;
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
  try {
    const res = await supabase.from(tableName).insert([data]).select();
    return res.error ? { error: true, ...res.error } : res.data;
  } catch (e) {
    return e;
  }
}

function getStoragePathFromPublicURL(publicURL) {
  const bucketName = "koop";
  const path = publicURL.split(`/${bucketName}/`)[1];

  //console.log(`Public url : "${publicURL}"`);
  //console.log(`Relative url : "${path}"`);

  return path;
}

export async function removeServReq(item_id) {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAMES.KOOP_SERVICE_REQUEST)
      .select("images")
      .eq("id", item_id);
    //const r =  await supabase.from(TABLE_NAMES.KOOP_SERVICE_REQUEST).delete().eq('id', item_id).single()

    //const

    if (error) {
      console.error(error);
      return error;
    }

    if (data.length === 1) {
      const images = data[0].images;

      console.warn("Images => ", images);

      if (images && images.length > 0) {
        const pmz = [];

        images.forEach((url, i) => {
          const pathToRemove = getStoragePathFromPublicURL(url);
          console.log(`Removing "${pathToRemove}"`);

          pmz.push(supabase.storage.from("koop").remove(pathToRemove));
        });

        let r = await Promise.all(pmz);
        r = await supabase
          .from(TABLE_NAMES.KOOP_SERVICE_REQUEST)
          .delete()
          .eq("id", item_id);

        return r;
      } else {
        const error = {
          error: true,
          message: `No images found for item_id ${item_id}`,
        };
        return error;
      }
    }

    return {
      error: true,
      message: `Item with item_id '${item_id}' not found!`,
    };
  } catch (e) {
    return e;
  }
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

export async function deleteItem(tableName, rowName, rowVal) {
  let r;
  if (rowName && rowVal) {
    r = supabase.from(tableName).delete().eq(rowName, rowVal);
  } else {
    r = supabase.from(tableName).delete().neq("id", -9999);
  }

  return await r;
}

export async function removeAllFilesAndDirectories() {
  // Fetch all items (files and directories) from the bucket
  const { data, error } = await supabase.storage.from("koop").list();

  if (error) {
    console.error("Error fetching items:", error.message);
    return;
  }

  // Delete each item
  for (const item of data) {
    const { error: deleteError } = await supabase.storage
      .from("koop")
      .remove(item.name);

    if (deleteError) {
      console.error(`Error deleting ${item.name}:`, deleteError.message);
      return deleteError;
    } else {
      console.log(`${item.name} deleted successfully`);
      return true;
    }
  }

  console.log("All files and directories deleted from the bucket");
  return true;
}

export async function incrementValue(tableName, rowToInrement, keyRow, keyVal) {
  const d = await supabase
    .from(tableName)
    .select(rowToInrement)
    .eq(keyRow, keyVal);

  console.log(`Selecting rowToIncrement ${rowToInrement}`);
  return d;
}
