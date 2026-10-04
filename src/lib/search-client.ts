export interface SearchData {
  url: string;
  meta: { title?: string };
  excerpt: string;
  filters: { kind?: string[] };
}
export interface SearchResult {
  data(): Promise<SearchData>;
}
interface PagefindInstance {
  search(
    query: string,
    options: { filters?: Record<string, string> }
  ): Promise<{ results: SearchResult[] }>;
  destroy(): Promise<void>;
}

interface PagefindModule {
  createInstance(): PagefindInstance;
}

export function createSearchClient(
  loadModule: (url: string) => Promise<PagefindModule> = (url) => import(/* @vite-ignore */ url)
) {
  let index: Promise<PagefindInstance> | undefined;
  let attempt = 0;
  let generation = 0;
  const dispose = () => {
    generation++;
    const previous = index;
    index = undefined;
    void previous?.then((instance) => instance.destroy()).catch(() => undefined);
  };
  return {
    async search(query: string, kind: string) {
      const request = generation;
      const url = `/pagefind/pagefind.js${attempt ? `?retry=${attempt}` : ""}`;
      index ??= loadModule(url).then((module) => {
        if (request !== generation) throw new Error("Search was cancelled");
        // A fresh instance reads this page's language. The module singleton would
        // keep the first language searched even after an Astro language switch.
        return module.createInstance();
      });
      const instance = await index;
      if (request !== generation) throw new Error("Search was cancelled");
      return instance.search(query, kind === "all" ? {} : { filters: { kind } });
    },
    reset() {
      // Failed module imports are cached by the browser, so retry with a fresh URL.
      dispose();
      attempt++;
    },
    destroy: dispose,
  };
}

export function excerptTokens(html: string) {
  const tokens: { text: string; highlight: boolean }[] = [];
  const walk = (node: Node, highlight = false) => {
    if (node.nodeType === Node.TEXT_NODE) tokens.push({ text: node.textContent ?? "", highlight });
    else if (node instanceof Element && !["SCRIPT", "STYLE"].includes(node.tagName))
      node.childNodes.forEach((child) => walk(child, highlight || node.tagName === "MARK"));
  };
  walk(new DOMParser().parseFromString(html, "text/html").body);
  return tokens;
}
