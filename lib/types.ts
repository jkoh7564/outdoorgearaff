export type PostStatus = "draft" | "published";

export type GearItem = {
  id: string;
  post_id: string;
  name: string;
  category: string | null;
  features: string[] | null;
  benefits: string[] | null;
  affiliate_url: string;
  price_display: string | null;
  image_url: string | null;
  created_at: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  body: string | null;
  status: PostStatus;
  hero_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  ai_summary: string | null;
  ai_summary_source: string | null;
  ai_summary_confidence: number | null;
  ai_summary_review_status: string | null;
  published_at: string | null;
  created_at: string;
};

export type PostWithGear = Post & {
  gear_items: GearItem[];
};

export type GearItemInput = {
  id?: string;
  name: string;
  category: string;
  featuresText: string;
  benefitsText: string;
  affiliate_url: string;
  price_display: string;
  image_url: string;
};

export type PostEditorInput = {
  id?: string;
  title: string;
  slug: string;
  body: string;
  status: PostStatus;
  hero_image_url: string;
  seo_title: string;
  seo_description: string;
  gearItems: GearItemInput[];
};
