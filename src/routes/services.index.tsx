import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/services/")({
  component: ServicesRedirect,
});

function ServicesRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.navigate({ to: "/areas-of-expertise", replace: true });
  }, [router]);
  return null;
}
