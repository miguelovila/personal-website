import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import {
  getFeatureFlags,
  isFeatureEnabled,
  isHomeOnlySite,
  setFeatureFlagsOverride,
} from "../src/lib/feature-flags";
import { navigationRoutes } from "../src/components/navigation/routes";

describe("FeatureFlag system", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    setFeatureFlagsOverride(null);
    delete process.env.FEATURE_BLOG;
    delete process.env.FEATURE_PROJECTS;
    delete process.env.FEATURE_ABOUT;
    delete process.env.FEATURE_SEARCH;
    delete process.env.FEATURE_FLAG_BLOG;
    delete process.env.FEATURE_FLAG_PROJECTS;
    delete process.env.FEATURE_FLAG_ABOUT;
    delete process.env.FEATURE_FLAG_SEARCH;
    delete process.env.FEATURE_FLAGS;
    delete process.env.PUBLIC_FEATURE_FLAGS;
    delete process.env.PUBLIC_FEATURE_BLOG;
    delete process.env.PUBLIC_FEATURE_PROJECTS;
    delete process.env.PUBLIC_FEATURE_ABOUT;
    delete process.env.PUBLIC_FEATURE_SEARCH;
    delete process.env.PUBLIC_FEATURE_FLAG_BLOG;
    delete process.env.PUBLIC_FEATURE_FLAG_PROJECTS;
    delete process.env.PUBLIC_FEATURE_FLAG_ABOUT;
    delete process.env.PUBLIC_FEATURE_FLAG_SEARCH;
  });

  afterEach(() => {
    setFeatureFlagsOverride(null);
    process.env = { ...originalEnv };
  });

  test("defaults all features to enabled when no env is set", () => {
    const flags = getFeatureFlags();
    expect(flags.blog).toBe(true);
    expect(flags.projects).toBe(true);
    expect(flags.about).toBe(true);
    expect(flags.search).toBe(true);
    expect(isFeatureEnabled("blog")).toBe(true);
    expect(isFeatureEnabled("projects")).toBe(true);
    expect(isFeatureEnabled("about")).toBe(true);
    expect(isFeatureEnabled("search")).toBe(true);
  });

  test("respects individual boolean environment variables (false, 0, no, off)", () => {
    process.env.FEATURE_BLOG = "false";
    process.env.FEATURE_PROJECTS = "0";

    const flags = getFeatureFlags();
    expect(flags.blog).toBe(false);
    expect(flags.projects).toBe(false);
    expect(flags.about).toBe(true);
    // When both blog and projects are disabled, search defaults to false
    expect(flags.search).toBe(false);
  });

  test("respects individual boolean environment variables (true, 1, yes, on)", () => {
    process.env.FEATURE_BLOG = "1";
    process.env.FEATURE_PROJECTS = "yes";
    process.env.FEATURE_SEARCH = "true";

    const flags = getFeatureFlags();
    expect(flags.blog).toBe(true);
    expect(flags.projects).toBe(true);
    expect(flags.search).toBe(true);
  });

  test("respects FEATURE_FLAGS landing and none bulk specifications", () => {
    for (const value of ["landing", "none"]) {
      process.env.FEATURE_FLAGS = value;

      const flags = getFeatureFlags();
      expect(flags.blog).toBe(false);
      expect(flags.projects).toBe(false);
      expect(flags.about).toBe(false);
      expect(flags.search).toBe(false);
    }
  });

  test("respects FEATURE_FLAGS list enabling only specified features", () => {
    process.env.FEATURE_FLAGS = "about";

    const flags = getFeatureFlags();
    expect(flags.blog).toBe(false);
    expect(flags.projects).toBe(false);
    expect(flags.about).toBe(true);
    expect(flags.search).toBe(false);
  });

  test("defaults search on when FEATURE_FLAGS enables searchable content", () => {
    process.env.FEATURE_FLAGS = "blog";

    const flags = getFeatureFlags();
    expect(flags.blog).toBe(true);
    expect(flags.projects).toBe(false);
    expect(flags.about).toBe(false);
    expect(flags.search).toBe(true);
  });

  test("respects FEATURE_FLAGS with negative prefixes (-blog, -projects)", () => {
    process.env.FEATURE_FLAGS = "-blog, -projects";

    const flags = getFeatureFlags();
    expect(flags.blog).toBe(false);
    expect(flags.projects).toBe(false);
    expect(flags.about).toBe(true);
    expect(flags.search).toBe(false);
  });

  test("allows explicit search override even when content features are false", () => {
    process.env.FEATURE_BLOG = "false";
    process.env.FEATURE_PROJECTS = "false";
    process.env.FEATURE_SEARCH = "true";

    const flags = getFeatureFlags();
    expect(flags.blog).toBe(false);
    expect(flags.projects).toBe(false);
    expect(flags.search).toBe(true);
  });

  test("individual environment variables override FEATURE_FLAGS", () => {
    process.env.FEATURE_FLAGS = "landing";
    process.env.FEATURE_BLOG = "true";

    const flags = getFeatureFlags();
    expect(flags.blog).toBe(true);
    expect(flags.projects).toBe(false);
    expect(flags.about).toBe(false);
    expect(flags.search).toBe(true);
  });

  test("treats all false individual overrides as a home-only site", () => {
    process.env.FEATURE_FLAGS = "all";
    process.env.FEATURE_BLOG = "false";
    process.env.FEATURE_PROJECTS = "false";
    process.env.FEATURE_ABOUT = "false";
    process.env.FEATURE_SEARCH = "false";

    const flags = getFeatureFlags();
    expect(flags).toEqual({
      blog: false,
      projects: false,
      about: false,
      search: false,
    });
    expect(isHomeOnlySite(flags)).toBe(true);
  });

  test("in-memory override works for tests", () => {
    setFeatureFlagsOverride({ blog: false });
    expect(isFeatureEnabled("blog")).toBe(false);
    expect(isFeatureEnabled("projects")).toBe(true);
  });

  test("navigationRoutes reflects feature flags", () => {
    // Default: 4 routes (home, projects, posts, about)
    expect(navigationRoutes("en").map((r) => r.title)).toEqual([
      "Home",
      "Projects",
      "Blog",
      "About",
    ]);

    // Blog and Projects disabled: 2 routes (home, about)
    setFeatureFlagsOverride({ blog: false, projects: false });
    expect(navigationRoutes("en").map((r) => r.title)).toEqual(["Home", "About"]);
    expect(navigationRoutes("pt").map((r) => r.title)).toEqual(["Início", "Sobre"]);

    // Landing page mode (blog, projects, about all false): 1 route (home)
    setFeatureFlagsOverride({ blog: false, projects: false, about: false });
    expect(navigationRoutes("en").map((r) => r.title)).toEqual(["Home"]);
  });
});
