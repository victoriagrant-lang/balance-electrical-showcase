/*
  Testimonials collected directly (not on Google). Only add real reviews, quoted exactly,
  with the client's permission to use their name. Google reviews are pulled in live —
  see lib/google-reviews.ts — and shown alongside these.

  Example:
  { quote: "Victoria rewired our kitchen and ...", name: "Sarah", place: "Acacia Bay",
    project: "Kitchen renovation", rating: 5 },
*/
export type DirectReview = {
  quote: string;
  name: string;
  place?: string;
  project?: string;
  rating?: number;
};

export const REVIEWS: DirectReview[] = [];
