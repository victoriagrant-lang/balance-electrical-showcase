import type { GoogleReview } from "@/lib/google-reviews";

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

/*
  Reviews from Balance Electrical's Google Business Profile, copied word for word. They are
  shown only when the live lookup returns no reviews (no key yet, or Google unavailable), so
  the section always shows real reviews from the profile. Once the live reviews load, Google's
  own selection replaces these.
*/
export const SAVED_GOOGLE_REVIEWS: GoogleReview[] = [
  {
    author: "Karen Allen",
    rating: 5,
    relativeTime: "",
    text: "Victoria recently completed all the electrical work for a new build - she and her team were fantastic to work with, always had good suggestions and solutions and immaculate attention to detail. On top of that, she’s lovely! Thanks so much!",
  },
  {
    author: "Sophie Kelly",
    rating: 5,
    relativeTime: "",
    text: "Vic has been such an amazing Electrician for our build!! Massive attention to detail, super hard working and my favourite part, discuss options/plans/ideas and she gets it done! No having to get her to re-do anything.\nHighly recommend!",
  },
  {
    author: "Ashleigh Grant",
    rating: 5,
    relativeTime: "",
    text: "Victoria has been such a pleasure to work with. We recently hosted a fundraising event for a local charity, Pregnancy Help Taupo and she was incredibly generous with her donation. It was lovely to see her getting behind and supporting local initiatives 💕",
  },
];
