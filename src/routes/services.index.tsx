import { createFileRoute, redirect } from "@tanstack/react-router";

// The old /services page is now /areas-of-expertise. A permanent redirect sent by the server,
// so search engines carry the old page's ranking across instead of finding an empty page.
export const Route = createFileRoute("/services/")({
  beforeLoad: () => {
    throw redirect({ to: "/areas-of-expertise", statusCode: 301 });
  },
});
