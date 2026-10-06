/*
  Every review on Balance Electrical's Google Business Profile, read with the owner's
  permission through Google's Business Profile APIs (server-side only). Used in place of the
  Places API — which returns at most five reviews — once these are set in Vercel:

    GBP_CLIENT_ID, GBP_CLIENT_SECRET   the OAuth client from the Google Cloud project
    GBP_REFRESH_TOKEN                  from a one-time sign-in by the profile's owner
    GBP_LOCATION (optional)            "accounts/…/locations/…" to skip the lookup

  The project also needs Google's approval for Business Profile API access, and three APIs
  enabled: Google My Business API, My Business Account Management API and My Business
  Business Information API. See /api/reviews-status for what the last lookup found.
*/

import type { GoogleReview } from "@/lib/google-reviews";

export type BusinessProfileReviews = {
  rating: number | null;
  count: number;
  url?: string;
  location: string;
  title?: string;
  reviews: GoogleReview[];
};

const STARS: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
/** Pages of 50; enough for any small business, and a guard against a runaway loop. */
const MAX_PAGES = 20;

export function businessProfileConfigured() {
  return Boolean(
    process.env.GBP_CLIENT_ID && process.env.GBP_CLIENT_SECRET && process.env.GBP_REFRESH_TOKEN,
  );
}

let token: { value: string; until: number } | null = null;
let foundLocation: { name: string; title?: string; mapsUri?: string } | null = null;

/** Google's own explanation of a failed request, without anything secret. */
async function failure(what: string, res: Response) {
  let detail = "";
  try {
    const body = (await res.json()) as {
      error?: string | { message?: string; status?: string };
      error_description?: string;
    };
    detail =
      typeof body.error === "string"
        ? [body.error, body.error_description].filter(Boolean).join(": ")
        : [body.error?.status, body.error?.message].filter(Boolean).join(": ");
  } catch {
    // not JSON
  }
  return new Error(`${what} failed (${res.status})${detail ? ` — ${detail.slice(0, 300)}` : ""}`);
}

async function accessToken() {
  if (token && Date.now() < token.until) return token.value;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GBP_CLIENT_ID ?? "",
      client_secret: process.env.GBP_CLIENT_SECRET ?? "",
      refresh_token: process.env.GBP_REFRESH_TOKEN ?? "",
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw await failure("Google sign-in (refresh token)", res);
  const data = (await res.json()) as { access_token: string; expires_in?: number };
  token = {
    value: data.access_token,
    until: Date.now() + ((data.expires_in ?? 3600) - 120) * 1000,
  };
  return token.value;
}

async function get<T>(url: string, what: string): Promise<T> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${await accessToken()}` } });
  if (!res.ok) throw await failure(what, res);
  return (await res.json()) as T;
}

type Location = {
  name: string;
  title?: string;
  metadata?: { placeId?: string; mapsUri?: string };
};

/**
 * Balance Electrical's own listing among the locations the signed-in owner manages: the one
 * whose Google Maps link is the site's listing, otherwise the one named "Balance Electrical".
 * Returned as "accounts/{account}/locations/{location}", the form the reviews API wants.
 */
async function ourLocation(isOurListing: (mapsUrl?: string) => boolean) {
  if (process.env.GBP_LOCATION) return { name: process.env.GBP_LOCATION };
  if (foundLocation) return foundLocation;
  const accounts: { name: string }[] = [];
  let pageToken = "";
  do {
    const page = await get<{ accounts?: { name: string }[]; nextPageToken?: string }>(
      `https://mybusinessaccountmanagement.googleapis.com/v1/accounts?pageSize=20${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""}`,
      "Listing Business Profile accounts",
    );
    accounts.push(...(page.accounts ?? []));
    pageToken = page.nextPageToken ?? "";
  } while (pageToken);

  const found: { account: string; location: Location }[] = [];
  for (const account of accounts) {
    let next = "";
    do {
      const page = await get<{ locations?: Location[]; nextPageToken?: string }>(
        `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title,metadata.placeId,metadata.mapsUri&pageSize=100${next ? `&pageToken=${encodeURIComponent(next)}` : ""}`,
        "Listing Business Profile locations",
      );
      for (const location of page.locations ?? []) found.push({ account: account.name, location });
      next = page.nextPageToken ?? "";
    } while (next);
  }
  const match =
    found.find((f) => isOurListing(f.location.metadata?.mapsUri)) ??
    found.find((f) => /balance electrical/i.test(f.location.title ?? ""));
  if (!match) {
    const titles = found.map((f) => f.location.title ?? f.location.name).join(", ") || "none";
    throw new Error(
      `The signed-in Google account doesn't manage a "Balance Electrical" listing (it manages: ${titles})`,
    );
  }
  foundLocation = {
    // Business Information names locations "locations/{id}"; reviews live under the account.
    name: `${match.account}/${match.location.name}`,
    title: match.location.title,
    mapsUri: match.location.metadata?.mapsUri,
  };
  return foundLocation;
}

type ApiReview = {
  reviewId?: string;
  reviewer?: { displayName?: string; profilePhotoUrl?: string; isAnonymous?: boolean };
  starRating?: string;
  comment?: string;
  createTime?: string;
  reviewReply?: { comment?: string };
};

/**
 * Google returns reviews written in another language as "(Translated by Google) … (Original) …".
 * Keep the reviewer's own words.
 */
export function originalText(comment = "") {
  const text = comment.trim();
  const original = text.split(/\(Original\)\s*/i);
  if (original.length > 1) return original[1].trim();
  return text.replace(/\s*\(Translated by Google\)[\s\S]*$/i, "").trim();
}

const relative = new Intl.RelativeTimeFormat("en-NZ", { numeric: "auto" });

/** "2 years ago", "3 months ago" — how Google itself dates reviews. */
export function timeAgo(iso?: string, now = Date.now()) {
  if (!iso) return "";
  const days = (Date.parse(iso) - now) / 86_400_000;
  if (Number.isNaN(days)) return "";
  if (Math.abs(days) >= 365) return relative.format(Math.round(days / 365), "year");
  if (Math.abs(days) >= 30) return relative.format(Math.round(days / 30), "month");
  if (Math.abs(days) >= 7) return relative.format(Math.round(days / 7), "week");
  return relative.format(Math.round(days), "day");
}

export async function fetchBusinessProfileReviews(
  isOurListing: (mapsUrl?: string) => boolean,
): Promise<BusinessProfileReviews> {
  const location = await ourLocation(isOurListing);
  const reviews = new Map<string, ApiReview>();
  let rating: number | null = null;
  let count = 0;
  let pageToken = "";
  for (let page = 0; page < MAX_PAGES; page++) {
    const data = await get<{
      reviews?: ApiReview[];
      averageRating?: number;
      totalReviewCount?: number;
      nextPageToken?: string;
    }>(
      `https://mybusiness.googleapis.com/v4/${location.name}/reviews?pageSize=50&orderBy=${encodeURIComponent("updateTime desc")}${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""}`,
      "Reading Business Profile reviews",
    );
    if (page === 0) {
      rating = data.averageRating ?? null;
      count = data.totalReviewCount ?? 0;
    }
    // Later pages can repeat a review (a known Google issue), so keep each one once.
    for (const r of data.reviews ?? []) reviews.set(r.reviewId ?? `${reviews.size}`, r);
    pageToken = data.nextPageToken ?? "";
    if (!pageToken) break;
  }
  return {
    rating: rating ? Math.round(rating * 10) / 10 : null,
    count,
    url: location.mapsUri,
    location: location.name,
    title: location.title,
    reviews: [...reviews.values()]
      .map((r) => ({
        author: r.reviewer?.isAnonymous
          ? "A Google user"
          : (r.reviewer?.displayName ?? "A Google user"),
        photo: r.reviewer?.isAnonymous ? undefined : r.reviewer?.profilePhotoUrl,
        rating: STARS[r.starRating ?? ""] ?? 0,
        text: originalText(r.comment),
        relativeTime: timeAgo(r.createTime),
        publishTime: r.createTime,
        reply: r.reviewReply?.comment ? originalText(r.reviewReply.comment) : undefined,
      }))
      .filter((r) => r.text),
  };
}
