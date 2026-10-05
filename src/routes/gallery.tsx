import { createFileRoute, redirect } from "@tanstack/react-router";

// The previous site's /gallery is still in Google's index; the gallery is now /projects.
// A permanent redirect sent by the server carries its ranking across.
export const Route = createFileRoute("/gallery")({
  beforeLoad: () => {
    throw redirect({ to: "/projects", statusCode: 301 });
  },
});
