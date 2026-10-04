import { createServerFn } from "@tanstack/react-start";

/*
  Live Google reviews for the Balance Electrical Business Profile, fetched on the server
  from the Google Places API and cached for six hours, so new reviews appear on the site
  automatically. Needs GOOGLE_PLACES_API_KEY in the hosting environment (Vercel →
  Settings → Environment Variables). GOOGLE_PLACE_ID is optional — without it the
  place is found once by name. With no key set, the site simply shows the Google link.
*/

export type GoogleReview = {
  author: string;
  authorUrl?: string;
  photo?: string;
  rating: number;
  text: string;
  relativeTime: string;
  publishTime?: string;
};

export type GoogleReviews = {
  rating: number | null;
  count: number;
  url: string;
  reviews: GoogleReview[];
};

export const GOOGLE_PROFILE_URL = "https://g.page/r/CUTDVwlL1oZeEBM";
export const GOOGLE_WRITE_REVIEW_URL = "https://g.page/r/CUTDVwlL1oZeEBM/review";

const EMPTY: GoogleReviews = { rating: null, count: 0, url: GOOGLE_PROFILE_URL, reviews: [] };
const TTL_MS = 6 * 60 * 60 * 1000;

let cache: { at: number; data: GoogleReviews } | null = null;
let foundPlaceId: string | undefined;

type PlacesReview = {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  publishTime?: string;
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
};

async function placeId(key: string) {
  if (process.env.GOOGLE_PLACE_ID) return process.env.GOOGLE_PLACE_ID;
  if (foundPlaceId) return foundPlaceId;
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "places.id,places.displayName",
    },
    body: JSON.stringify({ textQuery: "Balance Electrical Taupō", regionCode: "NZ" }),
  });
  if (!res.ok) throw new Error(`Places search ${res.status}`);
  const data = (await res.json()) as {
    places?: { id: string; displayName?: { text?: string } }[];
  };
  // Only accept a result that is actually Balance — never show another business's reviews.
  foundPlaceId = data.places?.find((p) => /balance/i.test(p.displayName?.text ?? ""))?.id;
  return foundPlaceId;
}

async function fetchReviews(): Promise<GoogleReviews> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return EMPTY;
  const id = await placeId(key);
  if (!id) return EMPTY;
  const res = await fetch(`https://places.googleapis.com/v1/places/${id}?languageCode=en`, {
    headers: {
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri",
    },
  });
  if (!res.ok) throw new Error(`Places details ${res.status}`);
  const place = (await res.json()) as {
    rating?: number;
    userRatingCount?: number;
    googleMapsUri?: string;
    reviews?: PlacesReview[];
  };
  return {
    rating: place.rating ?? null,
    count: place.userRatingCount ?? 0,
    url: place.googleMapsUri ?? GOOGLE_PROFILE_URL,
    reviews: (place.reviews ?? [])
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? "Google user",
        authorUrl: r.authorAttribution?.uri,
        photo: r.authorAttribution?.photoUri,
        rating: r.rating ?? 0,
        text: (r.originalText?.text ?? r.text?.text ?? "").trim(),
        relativeTime: r.relativePublishTimeDescription ?? "",
        publishTime: r.publishTime,
      }))
      .filter((r) => r.text),
  };
}

export const getGoogleReviews = createServerFn({ method: "GET" }).handler(async () => {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.data;
  try {
    const data = await fetchReviews();
    cache = { at: Date.now(), data };
    return data;
  } catch (e) {
    console.error("Google reviews unavailable:", (e as Error).message);
    return cache?.data ?? EMPTY;
  }
});
