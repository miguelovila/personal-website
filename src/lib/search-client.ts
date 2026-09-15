export interface SearchData {
  url: string;
  meta: { title?: string };
  excerpt: string;
  filters: { kind?: string[] };
}
export interface SearchResult {
  data(): Promise<SearchData>;
}
interface Pagefind {
  search(
    query: string,
    options: { filters?: Record<string, string> }
  ): Promise<{ results: SearchResult[] }>;
}

export function createSearchClient() {
  let index: Promise<Pagefind> | undefined;
  let attempt = 0;
  return {
    async search(query: string, kind: string) {
      const url = `/pagefind/pagefind.js${attempt ? `?retry=${attempt}` : ""}`;
      index ??= import(/* @vite-ignore */ url);
      return (await index).search(query, kind === "all" ? {} : { filters: { kind } });
    },
    reset() {
      // Failed module imports are cached by the browser, so retry with a fresh URL.
      index = undefined;
      attempt++;
    },
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
