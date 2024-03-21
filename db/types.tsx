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
}

export type KoopShop = {
  id: number; // Changed Number to number
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
