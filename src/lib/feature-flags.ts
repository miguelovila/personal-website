export type FeatureName = "blog" | "projects" | "about" | "search";

export interface FeatureFlags {
  blog: boolean;
  projects: boolean;
  about: boolean;
  search: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  blog: true,
  projects: true,
  about: true,
  search: true,
};

let testOverrides: Partial<FeatureFlags> | null = null;

/**
 * For testing purposes only: allows overriding feature flags in-memory.
 */
export function setFeatureFlagsOverride(overrides: Partial<FeatureFlags> | null): void {
  testOverrides = overrides;
}

function getEnv(key: string): string | undefined {
  if (typeof process !== "undefined" && process.env) {
    const value = process.env[key];
    if (value !== undefined) return value;
  }

  const metaEnv = import.meta.env as Record<string, string | boolean | undefined> | undefined;
  const value = metaEnv?.[key];
  return typeof value === "boolean" ? String(value) : value;
}

function parseBoolean(val: string | undefined): boolean | undefined {
  if (val === undefined || val === null) return undefined;
  const normalized = String(val).trim().toLowerCase();
  if (["true", "1", "yes", "on", "enabled"].includes(normalized)) return true;
  if (["false", "0", "no", "off", "disabled"].includes(normalized)) return false;
  return undefined;
}

function readFeatureEnv(feature: FeatureName): boolean | undefined {
  const upper = feature.toUpperCase();
  const candidates = [
    `FEATURE_${upper}`,
    `FEATURE_FLAG_${upper}`,
    `PUBLIC_FEATURE_${upper}`,
    `PUBLIC_FEATURE_FLAG_${upper}`,
  ];

  for (const candidate of candidates) {
    const val = getEnv(candidate);
    const parsed = parseBoolean(val);
    if (parsed !== undefined) return parsed;
  }
  return undefined;
}

function parseFeatureFlagsList(listStr: string | undefined): Partial<FeatureFlags> | null {
  if (!listStr) return null;
  const items = listStr
    .toLowerCase()
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (
    items.includes("landing") ||
    items.includes("home") ||
    items.includes("none") ||
    items.includes("off") ||
    items.includes("disabled")
  ) {
    return { blog: false, projects: false, about: false };
  }

  if (items.includes("all") || items.includes("on") || items.includes("enabled")) {
    return { blog: true, projects: true, about: true, search: true };
  }

  // Check if all items are negative (e.g. -blog, no-blog, !blog)
  const hasOnlyNegatives = items.every(
    (item) => item.startsWith("-") || item.startsWith("no-") || item.startsWith("!")
  );
  if (hasOnlyNegatives) {
    const flags: Partial<FeatureFlags> = {};
    for (const item of items) {
      const clean = item.replace(/^[-!]|^(no-)/, "") as FeatureName;
      if (clean in DEFAULT_FLAGS) {
        flags[clean] = false;
      }
    }
    return flags;
  }

  // Positive list (e.g. "about" or "blog,projects"): unlisted content features become false.
  // Search still derives from enabled content unless the list explicitly includes it.
  const flags: Partial<FeatureFlags> = {
    blog: false,
    projects: false,
    about: false,
  };
  for (const item of items) {
    if (item in flags) {
      flags[item as FeatureName] = true;
    }
  }
  return flags;
}

export function getFeatureFlags(): FeatureFlags {
  if (testOverrides) {
    const resolvedSearch =
      testOverrides.search !== undefined
        ? testOverrides.search
        : (testOverrides.blog ?? DEFAULT_FLAGS.blog) ||
          (testOverrides.projects ?? DEFAULT_FLAGS.projects);

    return {
      blog: testOverrides.blog ?? DEFAULT_FLAGS.blog,
      projects: testOverrides.projects ?? DEFAULT_FLAGS.projects,
      about: testOverrides.about ?? DEFAULT_FLAGS.about,
      search: resolvedSearch,
    };
  }

  if (getEnv("SITE_TEST_CONTENT") === "1" && !getEnv("TEST_FEATURE_FLAGS")) {
    return DEFAULT_FLAGS;
  }

  const listEnv = getEnv("FEATURE_FLAGS") ?? getEnv("PUBLIC_FEATURE_FLAGS");
  const listFlags = parseFeatureFlagsList(listEnv);

  const blog = readFeatureEnv("blog") ?? listFlags?.blog ?? DEFAULT_FLAGS.blog;
  const projects = readFeatureEnv("projects") ?? listFlags?.projects ?? DEFAULT_FLAGS.projects;
  const about = readFeatureEnv("about") ?? listFlags?.about ?? DEFAULT_FLAGS.about;

  // Search defaults to enabled only if either blog or projects is active,
  // unless explicitly specified via FEATURE_SEARCH / listFlags.
  const explicitSearch = readFeatureEnv("search") ?? listFlags?.search;
  const search = explicitSearch !== undefined ? explicitSearch : blog || projects;

  return {
    blog,
    projects,
    about,
    search,
  };
}

export function isFeatureEnabled(feature: FeatureName): boolean {
  return getFeatureFlags()[feature];
}

export function hasSearchableContent(flags: FeatureFlags = getFeatureFlags()): boolean {
  return flags.blog || flags.projects;
}

export function shouldBuildSearch(flags: FeatureFlags = getFeatureFlags()): boolean {
  return flags.search && hasSearchableContent(flags);
}

export function isHomeOnlySite(flags: FeatureFlags = getFeatureFlags()): boolean {
  return !flags.blog && !flags.projects && !flags.about && !shouldBuildSearch(flags);
}
