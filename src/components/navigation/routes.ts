import { copy } from "@/lib/i18n";
import { localePath, type Language } from "@/lib/publishing";
import { getFeatureFlags, type FeatureFlags } from "@/lib/feature-flags";

export interface NavigationRoute {
  path: string;
  title: string;
}

export function navigationRoutes(
  language: Language,
  flags: FeatureFlags = getFeatureFlags()
): NavigationRoute[] {
  const t = copy[language];
  const routes: NavigationRoute[] = [{ path: localePath(language), title: t.home }];

  if (flags.projects) {
    routes.push({ path: localePath(language, "projects"), title: t.projects });
  }
  if (flags.blog) {
    routes.push({ path: localePath(language, "posts"), title: t.blog });
  }
  if (flags.about) {
    routes.push({ path: localePath(language, "about"), title: t.about });
  }

  return routes;
}
export function activeRoute(currentPath: string, routePath: string, language: Language) {
  const normalize = (path: string) => `${path.replace(/\/+$/, "")}/`;
  const current = normalize(currentPath);
  const route = normalize(routePath);
  return route === localePath(language) ? current === route : current.startsWith(route);
}
