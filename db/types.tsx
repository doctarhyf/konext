export type User = {
  id: number; // Changed Number to number
  created_at: Date;
  phone: string;
  pin: string;
  full_name: string;
  dob: string;
  email: string;
  ville: string;
  display_name: string;
  profile: string;
  shop_name: string;
  shop_tags: string;
  shop_desc: string;
  shop_add: string;
  shop_email: string;
  shop_web: string;
  shop_profile: string;
  shop_likes: number;
  shop_whatsapp: string;
  shop_wechat: string;
  shop_tiktok: string;
  shop_facebook: string;
};

export interface Message {
  id: number;
  created_at: Date;
  from_id: number;
  to_id: number;
  message: string;
  type: "in" | "out";
}

export interface Comment {
  id: number;
  created_at: Date;
  item_id: number;
  posted_by_id: number;
  comment: string;
  validate: "true" | "false";
  item_type: string;
}

export type KoopShop = {
  id: number; // Changed Number to number

  //user info
  profile: string;
  display_name: string;
  phone: string;

  created_at: Date;
  shop_id: number;
  shop_name: string;
  shop_tags: string;
  shop_desc: string;
  shop_profile: string;

  shop_add: string;

  //
  shop_email: string;
  shop_whatsapp: string;
  shop_wechat: string;
  shop_tiktok: string;
  shop_facebook: string;
};

export interface UserDataUpdate {
  user_id: number;
  data_key: string;
  new_value: string;
}

export interface ServiceRequest {
  id: number;
  created_at: Date;
  user_id: number;
  label: string;
  desc: string | null;
  tags: string[] | null;
  images: string[] | null;
  user_data: User | null;
  timeAgo: string | null;
}
