import { describe, expect, test } from "bun:test";
import { rejects } from "node:assert/strict";
import { createSearchClient } from "../src/lib/search-client";

describe("search client lifecycle", () => {
  test("a language switch uses a fresh index even when the module stays cached", async () => {
    let pageLanguage = "en";
    const destroyed: string[] = [];
    const cachedModule = {
      createInstance() {
        const language = pageLanguage;
        return {
          async search() {
            return {
              results: [
                {
                  async data() {
                    return {
                      url: language === "pt-PT" ? "/pt/projects/weather/" : "/projects/weather/",
                      meta: {
                        title: language === "pt-PT" ? "Estação meteorológica" : "Weather station",
                      },
                      excerpt: "",
                      filters: {},
                    };
                  },
                },
              ],
            };
          },
          async destroy() {
            destroyed.push(language);
          },
        };
      },
    };
    const load = async () => cachedModule;
    const english = createSearchClient(load);
    const englishResult = await (await english.search("weather", "all")).results[0].data();
    expect(englishResult.url).toBe("/projects/weather/");
    english.destroy();

    pageLanguage = "pt-PT";
    const portuguese = createSearchClient(load);
    const portugueseResult = await (
      await portuguese.search("meteorológica", "all")
    ).results[0].data();
    expect(portugueseResult.url).toBe("/pt/projects/weather/");
    expect(portugueseResult.meta.title).toBe("Estação meteorológica");
    expect(destroyed).toEqual(["en"]);
    portuguese.destroy();
  });

  test("closing a panel while its module loads cannot create a stale index", async () => {
    let resolveImport!: (module: {
      createInstance(): {
        search(): Promise<{ results: [] }>;
        destroy(): Promise<void>;
      };
    }) => void;
    let created = false;
    const client = createSearchClient(
      () =>
        new Promise((resolve) => {
          resolveImport = resolve;
        })
    );
    const pending = client.search("AES", "projects");
    client.destroy();
    resolveImport({
      createInstance() {
        created = true;
        return { search: async () => ({ results: [] }), destroy: async () => {} };
      },
    });
    await rejects(pending, /Search was cancelled/);
    expect(created).toBe(false);
  });

  test("retry uses a new import URL after a cached module failure", async () => {
    const urls: string[] = [];
    const client = createSearchClient(async (url) => {
      urls.push(url);
      if (urls.length === 1) throw new Error("Network unavailable");
      return {
        createInstance: () => ({
          search: async () => ({ results: [] }),
          destroy: async () => {},
        }),
      };
    });
    await rejects(client.search("AES", "all"), /Network unavailable/);
    client.reset();
    expect(await client.search("AES", "all")).toEqual({ results: [] });
    expect(urls).toEqual(["/pagefind/pagefind.js", "/pagefind/pagefind.js?retry=1"]);
    client.destroy();
  });
});
