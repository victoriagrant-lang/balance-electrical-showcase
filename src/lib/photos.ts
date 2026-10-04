const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://nrhfbcqmfsezlkxnzshq.supabase.co";
const STORAGE_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || "Website Photos";
const BASE = `${SUPABASE_URL}/storage/v1/object/public/${encodeURIComponent(STORAGE_BUCKET)}/`;

const enc = (n: string) => BASE + encodeURIComponent(n);

export const photos = {
  favicon: enc("favicon.webp"),
  logo: enc("Balance+Electrical+-+white+text+(003).webp"),
  ewrbLogo: enc("new-ewrb-logo.png"),
  twilight: enc("twlight.jpg.jpeg"),
  kitchen: enc("kitchen.JPG.jpeg"),
  living: enc("Living.JPG.jpeg"),
  fountainEntry: enc("Fountain+entry.jpg.jpeg"),
  img0003: enc("IMG_0003.jpg.jpeg"),
  img0004: enc("IMG_0004.jpg.jpeg"),
  img0004b: enc("IMG_0004.jpg_1.jpeg"),
  img0005: enc("IMG_0005.jpg.jpeg"),
  img0006: enc("IMG_0006.jpg.jpeg"),
  img0011: enc("IMG_0011.webp"),
  img0011jpeg: enc("IMG_0011.jpg.jpeg"),
  img0419: enc("IMG_0419.jpg.jpeg"),
  media: enc("media.jpg.jpeg"),
  victoria: enc("victoria-profile.jpeg"),
  img0004c: enc("IMG_0004_c.jpg.jpeg"),
};
