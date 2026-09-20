import { feed } from "@/lib/feed";
import { isFeatureEnabled } from "@/lib/feature-flags";

export const GET = () => {
  if (!isFeatureEnabled("blog")) {
    return new Response(null, { status: 404, statusText: "Not Found" });
  }
  return feed("en");
};
