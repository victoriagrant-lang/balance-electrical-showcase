/*
  Client testimonials. Only add real reviews, quoted exactly, with the client's
  permission to use their name (first name and suburb is fine). They appear on the
  About page beside the award and are included in the site's structured data.

  Example:
  { quote: "Victoria rewired our kitchen and ...", name: "Sarah", place: "Acacia Bay",
    project: "Kitchen renovation", source: "Google", rating: 5 },
*/
export type Review = {
  quote: string;
  name: string;
  place?: string;
  project?: string;
  source: "Google" | "Direct";
  rating?: number;
};

export const REVIEWS: Review[] = [];

/** Opens the Balance Electrical listing on Google Maps, where the reviews are shown. */
export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/search/?api=1&query=Balance%20Electrical%20Taup%C5%8D";

/**
 * Direct "write a review" link. Set this once the Google Business Profile is live:
 * Business Profile → "Ask for reviews" gives a link like https://g.page/r/XXXX/review
 */
export const GOOGLE_WRITE_REVIEW_URL: string | null = null;
