import { createFileRoute } from "@tanstack/react-router";
import { reviewsStatus } from "@/lib/google-reviews";

// Shows whether the live Google reviews are working: key set, listing found, rating and
// count, and Google's own error message if not. Never shows the key. Add ?refresh=1 to
// re-check straight after changing the key or GOOGLE_PLACE_ID in Vercel.
export const Route = createFileRoute("/api/reviews-status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const refresh = new URL(request.url).searchParams.has("refresh");
        const status = await reviewsStatus({ refresh });
        return new Response(JSON.stringify(status, null, 2), {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
            "X-Robots-Tag": "noindex",
          },
        });
      },
    },
  },
});
