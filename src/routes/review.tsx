import { createFileRoute, redirect } from "@tanstack/react-router";
import { GOOGLE_WRITE_REVIEW_URL } from "@/lib/google-reviews";

// A short link for invoices, cards and job-completion emails: balanceelectrical.co.nz/review
// opens the "write a review" box on Balance's Google Business Profile. Kept out of the sitemap.
export const Route = createFileRoute("/review")({
  beforeLoad: () => {
    throw redirect({ href: GOOGLE_WRITE_REVIEW_URL, statusCode: 302 });
  },
});
