import { createClient } from "@/lib/supabase/server";

const seedPosts = [
  {
    id: "a1b2c3d4-0001-0001-0001-000000000001",
    slug: "best-hiking-boots-2024",
    title: "Best Hiking Boots for 2024: Conquer Any Trail",
    body: "Whether you are tackling rocky ridgelines or muddy forest paths, the right hiking boot makes all the difference. These picks balance grip, waterproofing, support, and all-day comfort for hikers who want fewer blisters and more miles.",
    status: "published",
    hero_image_url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200",
    seo_title: "Best Hiking Boots 2024 | OutdoorGearAff",
    seo_description: "Our top picks for hiking boots that handle any terrain.",
    published_at: new Date(Date.now() - 10 * 86_400_000).toISOString(),
  },
  {
    id: "a1b2c3d4-0002-0002-0002-000000000002",
    slug: "ultralight-backpacking-tents",
    title: "Ultralight Backpacking Tents That Do Not Sacrifice Shelter",
    body: "Going ultralight does not mean going unprotected. These tents keep pack weight down while still offering real weather protection, usable interior space, and fast setup after a long trail day.",
    status: "published",
    hero_image_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200",
    seo_title: "Best Ultralight Tents 2024 | OutdoorGearAff",
    seo_description: "Top ultralight tents for backpackers who want to go fast without getting soaked.",
    published_at: new Date(Date.now() - 5 * 86_400_000).toISOString(),
  },
  {
    id: "a1b2c3d4-0003-0003-0003-000000000003",
    slug: "headlamps-for-camping",
    title: "Top Headlamps for Camping and Night Hiking",
    body: "A reliable headlamp is non-negotiable on the trail. We break down brightness, battery life, waterproofing, and camp-friendly modes across dependable options for night hiking and weekend camping.",
    status: "published",
    hero_image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
    seo_title: "Best Camping Headlamps 2024 | OutdoorGearAff",
    seo_description: "Five headlamps tested for brightness, battery life, and weather resistance.",
    published_at: new Date(Date.now() - 2 * 86_400_000).toISOString(),
  },
];

const seedGear = [
  {
    id: "b1b2c3d4-0001-0001-0001-000000000001",
    post_id: "a1b2c3d4-0001-0001-0001-000000000001",
    name: "Salomon X Ultra 4 GTX",
    category: "Boots",
    features: ["Gore-Tex waterproof lining", "Contagrip outsole", "Advanced Chassis stability frame"],
    benefits: ["Keeps feet dry crossing streams", "Grips slippery rocks with confidence", "Reduces ankle fatigue on long days"],
    affiliate_url: "https://example.com/salomon-x-ultra-4",
    price_display: "$180",
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
  },
  {
    id: "b1b2c3d4-0002-0002-0002-000000000002",
    post_id: "a1b2c3d4-0002-0002-0002-000000000002",
    name: "Big Agnes Copper Spur HV UL2",
    category: "Tent",
    features: ["Low trail weight", "Double-wall construction", "Fast pole architecture"],
    benefits: ["Barely notice it in your pack", "Handles rain without condensation drips", "Sets up quickly at dusk"],
    affiliate_url: "https://example.com/big-agnes-copper-spur",
    price_display: "$550",
    image_url: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600",
  },
  {
    id: "b1b2c3d4-0003-0003-0003-000000000003",
    post_id: "a1b2c3d4-0003-0003-0003-000000000003",
    name: "Black Diamond Spot 400",
    category: "Lighting",
    features: ["400-lumen max output", "IP67 waterproof rating", "Red night-vision mode"],
    benefits: ["Lights up the full trail ahead", "Stays on through downpours", "Preserves night vision at camp"],
    affiliate_url: "https://example.com/bd-spot-400",
    price_display: "$50",
    image_url: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600",
  },
];

export async function ensureSeedData() {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true });

  if (error || (count ?? 0) > 0) return;

  await supabase.from("posts").upsert(seedPosts, { onConflict: "id" });
  await supabase.from("gear_items").upsert(seedGear, { onConflict: "id" });
}
