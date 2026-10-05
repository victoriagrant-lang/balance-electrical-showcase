import { createServerFn } from "@tanstack/react-start";

/*
  Live Google reviews for the Balance Electrical Business Profile, fetched on the server
  from the Google Places API and cached for six hours, so new reviews appear on the site
  automatically. Needs GOOGLE_PLACES_API_KEY in the hosting environment (Vercel →
  Settings → Environment Variables). GOOGLE_PLACE_ID is optional — without it the
  place is found once by name. With no key set, the site simply shows the Google links.

  Google returns the rating, the total count and up to five reviews (its "most relevant").
  /api/reviews-status shows what the last lookup found, for checking the setup.
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
/**
 * Balance Electrical's Google Maps listing ID (the "cid" — the number the g.page link above
 * stands for). Reviews are only ever taken from the listing with this ID.
 */
const PROFILE_CID = "6811367104212091716";

const EMPTY: GoogleReviews = { rating: null, count: 0, url: GOOGLE_PROFILE_URL, reviews: [] };
const TTL_MS = 6 * 60 * 60 * 1000;
const SEARCH = "Balance Electrical Taupō";

let cache: { at: number; data: GoogleReviews } | null = null;
let foundPlaceId: string | undefined;

/** What the last lookup did. Never holds the key. */
type LookupNotes = {
  placeIdFrom: "GOOGLE_PLACE_ID" | "search" | null;
  placeId?: string;
  placeName?: string;
  mapsUrl?: string;
  /** True when the listing found is the one the site's Google link points to. */
  matchesSiteGoogleLink?: boolean;
  searchResults?: string[];
  error?: string;
  checkedAt?: string;
};
let notes: LookupNotes = { placeIdFrom: null };

type PlacesReview = {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  publishTime?: string;
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
};

function isOurListing(mapsUrl?: string) {
  try {
    return !!mapsUrl && new URL(mapsUrl).searchParams.get("cid") === PROFILE_CID;
  } catch {
    return false;
  }
}

/** Google's own explanation of a failed request (bad key, API not enabled, billing…). */
async function failure(what: string, res: Response) {
  let detail = "";
  try {
    const body = (await res.json()) as { error?: { message?: string; status?: string } };
    detail = [body.error?.status, body.error?.message].filter(Boolean).join(": ");
  } catch {
    // not JSON
  }
  return new Error(`${what} failed (${res.status})${detail ? ` — ${detail.slice(0, 300)}` : ""}`);
}

async function placeId(key: string) {
  if (process.env.GOOGLE_PLACE_ID) {
    notes.placeIdFrom = "GOOGLE_PLACE_ID";
    return process.env.GOOGLE_PLACE_ID;
  }
  if (foundPlaceId) return foundPlaceId;
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "places.id,places.displayName,places.googleMapsUri",
    },
    body: JSON.stringify({ textQuery: SEARCH, regionCode: "NZ" }),
  });
  if (!res.ok) throw await failure("Places search", res);
  const data = (await res.json()) as {
    places?: { id: string; displayName?: { text?: string }; googleMapsUri?: string }[];
  };
  const places = data.places ?? [];
  notes.searchResults = places.map((p) => p.displayName?.text ?? "(no name)");
  // Only accept Balance Electrical's own listing — never another business's reviews. The
  // listing the site links to first; failing that, one named "Balance Electrical".
  const match =
    places.find((p) => isOurListing(p.googleMapsUri)) ??
    places.find((p) => /balance electrical/i.test(p.displayName?.text ?? ""));
  foundPlaceId = match?.id;
  notes.placeIdFrom = match ? "search" : null;
  return foundPlaceId;
}

async function fetchReviews(): Promise<GoogleReviews> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return EMPTY;
  const id = await placeId(key);
  if (!id) throw new Error(`No Google listing named "Balance Electrical" found for "${SEARCH}"`);
  const res = await fetch(`https://places.googleapis.com/v1/places/${id}?languageCode=en`, {
    headers: {
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews,googleMapsUri",
    },
  });
  if (!res.ok) throw await failure("Places details", res);
  const place = (await res.json()) as {
    displayName?: { text?: string };
    rating?: number;
    userRatingCount?: number;
    googleMapsUri?: string;
    reviews?: PlacesReview[];
  };
  notes.placeId = id;
  notes.placeName = place.displayName?.text;
  notes.mapsUrl = place.googleMapsUri;
  notes.matchesSiteGoogleLink = isOurListing(place.googleMapsUri);
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

async function loadReviews(): Promise<GoogleReviews> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.data;
  try {
    const data = await fetchReviews();
    notes.error = undefined;
    notes.checkedAt = new Date().toISOString();
    if (process.env.GOOGLE_PLACES_API_KEY) cache = { at: Date.now(), data };
    return data;
  } catch (e) {
    notes.error = (e as Error).message;
    notes.checkedAt = new Date().toISOString();
    console.error("Google reviews unavailable:", notes.error);
    return cache?.data ?? EMPTY;
  }
}

export const getGoogleReviews = createServerFn({ method: "GET" }).handler(loadReviews);

let lastRefresh = 0;

/**
 * For /api/reviews-status: whether the key is set, which listing was found, what came back,
 * and Google's error message if the lookup failed. `refresh` re-runs the lookup now (at most
 * once a minute), e.g. after changing the key or GOOGLE_PLACE_ID in Vercel.
 */
export async function reviewsStatus({ refresh = false } = {}) {
  if (refresh && Date.now() - lastRefresh > 60_000) {
    lastRefresh = Date.now();
    cache = null;
    foundPlaceId = undefined;
    notes = { placeIdFrom: null };
  }
  const data = await loadReviews();
  return {
    keySet: Boolean(process.env.GOOGLE_PLACES_API_KEY),
    placeIdSetInVercel: Boolean(process.env.GOOGLE_PLACE_ID),
    ...notes,
    rating: data.rating,
    count: data.count,
    reviewsWithText: data.reviews.length,
    reviewers: data.reviews.map((r) => r.author),
    cachedFor: cache ? `${Math.round((Date.now() - cache.at) / 60_000)} min` : null,
    ok: Boolean(data.rating && !notes.error),
  };
}
