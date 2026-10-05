import { createFileRoute, redirect } from "@tanstack/react-router";

// There is no list page for /areas: every place is linked from /areas-of-expertise and the
// footer. A permanent redirect sent by the server, so the bare URL is never an empty page.
export const Route = createFileRoute("/areas/")({
  beforeLoad: () => {
    throw redirect({ to: "/areas-of-expertise", statusCode: 301 });
  },
});
