import { createClient } from "@supabase/supabase-js";

export const TABLE_NAMES = {
  KOOP_USERS: "koop_users",
  KOOP_SHOPS: "koop_shops",
  KOOP_ITEMS: "koop_items",
  KOOP_COMMENTS: "koop_comments",
  KOOP_MSG_OUTBOX: "koop_messages_out",
  KOOP_MSG_INBOX: "koop_messages_in",
  KOOP_ITEM_VIEWS_COUNT: "koop_items_views_count",
  KOOP_ITEMS_LIKES: "koop_items_likes",
  KOOP_MESSAGES: "koop_messages",
};

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

// Now you can use the 'supabase' client in your application
//console.log(supabase, supabaseUrl, supabaseKey);
