import { Fragment, useEffect, useId, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { copy } from "@/lib/i18n";
import { localePath, type Language } from "@/lib/publishing";
import {
  createSearchClient,
  excerptTokens,
  type SearchData,
  type SearchResult,
} from "@/lib/search-client";

export interface SearchContentKinds {
  posts: boolean;
  projects: boolean;
}

interface Props {
  language: Language;
  hasContent: boolean;
  contentKinds: SearchContentKinds;
  modal?: boolean;
  syncURL?: boolean;
}
export default function SearchPanel({
  language,
  hasContent,
  contentKinds,
  modal = false,
  syncURL = false,
}: Props) {
  const t = copy[language];
  const availableKinds = useMemo(
    () =>
      [
        contentKinds.posts ? "posts" : undefined,
        contentKinds.projects ? "projects" : undefined,
      ].filter((kind): kind is "posts" | "projects" => Boolean(kind)),
    [contentKinds.posts, contentKinds.projects]
  );
  const hasKindFilter = availableKinds.length > 1;
  const kindOptions = useMemo(() => new Set(["all", ...availableKinds]), [availableKinds]);
  const searchHint =
    contentKinds.posts && contentKinds.projects
      ? t.searchHint
      : contentKinds.posts
        ? t.searchHintPosts
        : t.searchHintProjects;
  const searchPlaceholder =
    contentKinds.posts && contentKinds.projects
      ? t.searchPlaceholder
      : contentKinds.posts
        ? t.searchPlaceholderPosts
        : t.searchPlaceholderProjects;
  const id = useId();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");
  const [ready, setReady] = useState(!syncURL);
  const [attempt, setAttempt] = useState(0);
  const [phase, setPhase] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [items, setItems] = useState<SearchData[]>([]);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const handles = useRef<SearchResult[]>([]);
  const client = useRef(createSearchClient());
  const version = useRef(0);

  useEffect(() => {
    if (!syncURL) return;
    const restore = () => {
      const params = new URLSearchParams(location.search);
      const requestedKind = params.get("kind") ?? "";
      version.current++;
      setQuery(params.get("q") ?? "");
      setKind(kindOptions.has(requestedKind) ? requestedKind : "all");
      setReady(true);
    };
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [kindOptions, syncURL]);

  useEffect(() => {
    if (!ready) return;
    if (!kindOptions.has(kind)) {
      setKind("all");
      return;
    }
    const request = ++version.current;
    const term = query.trim();
    setItems([]);
    setTotal(0);
    setLoadingMore(false);
    if (syncURL) {
      const url = new URL(location.href);
      if (term) url.searchParams.set("q", term);
      else url.searchParams.delete("q");
      if (kind !== "all") url.searchParams.set("kind", kind);
      else url.searchParams.delete("kind");
      history.replaceState(null, "", url);
    }
    if (!term || !hasContent) {
      setPhase("idle");
      return;
    }
    setPhase("loading");
    const timer = setTimeout(async () => {
      try {
        const response = await client.current.search(term, kind);
        const data = await Promise.all(
          response.results.slice(0, 10).map((result) => result.data())
        );
        if (version.current !== request) return;
        handles.current = response.results;
        setItems(data);
        setTotal(response.results.length);
        setPhase("ready");
      } catch {
        if (version.current !== request) return;
        client.current.reset();
        setPhase("error");
      }
    }, 180);
    return () => {
      clearTimeout(timer);
      version.current++;
    };
  }, [query, kind, attempt, ready, hasContent, syncURL, kindOptions]);

  const showMore = async () => {
    const request = version.current;
    setLoadingMore(true);
    try {
      const next = await Promise.all(
        handles.current.slice(items.length, items.length + 10).map((result) => result.data())
      );
      if (version.current === request) setItems((current) => [...current, ...next]);
    } catch {
      if (version.current === request) {
        client.current.reset();
        setPhase("error");
      }
    } finally {
      if (version.current === request) setLoadingMore(false);
    }
  };
  const status = !hasContent
    ? t.archiveEmpty
    : phase === "error"
      ? t.searchError
      : phase === "loading"
        ? t.searchLoading
        : phase === "ready"
          ? total
            ? `${total} ${total === 1 ? t.resultOne : t.results}`
            : t.searchEmpty
          : t.searchStartBody;
  const Heading = modal ? "h3" : "h2";
  return (
    <div data-search-root data-search-phase={phase} className="min-w-0 space-y-6 wrap-anywhere">
      <form
        role="search"
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          version.current++;
          setAttempt((current) => current + 1);
        }}
      >
        <div className="space-y-2.5">
          <Label htmlFor={`${id}-query`} className="text-base">
            {t.searchLabel}
          </Label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-muted-foreground"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <Input
                id={`${id}-query`}
                name="q"
                type="search"
                value={query}
                onChange={(event) => {
                  version.current++;
                  setQuery(event.target.value);
                }}
                placeholder={searchPlaceholder}
                autoComplete="off"
                aria-describedby={`${id}-hint`}
                data-search-input
                className="h-11 pl-10 text-base md:text-base"
              />
            </div>
            <Button type="submit" className="h-11 w-full px-4 text-base sm:w-auto">
              {t.search}
            </Button>
          </div>
          <p id={`${id}-hint`} className="text-sm leading-relaxed text-muted-foreground">
            {searchHint}
          </p>
        </div>
        {hasKindFilter && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Label htmlFor={`${id}-kind`}>{t.searchType}</Label>
            <Select
              value={kind}
              onValueChange={(value) => {
                version.current++;
                setKind(value);
              }}
            >
              <SelectTrigger
                id={`${id}-kind`}
                className="w-40 max-w-full"
                aria-label={t.searchType}
                data-search-kind
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start" sideOffset={4}>
                <SelectItem value="all">{t.all}</SelectItem>
                {contentKinds.posts && <SelectItem value="posts">{t.blog}</SelectItem>}
                {contentKinds.projects && <SelectItem value="projects">{t.projects}</SelectItem>}
              </SelectContent>
            </Select>
          </div>
        )}
      </form>
      <div className="space-y-4">
        <p
          role="status"
          aria-live="polite"
          data-search-status
          className="text-base leading-relaxed text-muted-foreground"
        >
          {status}
        </p>
        {phase === "error" && (
          <Button
            variant="outline"
            className="min-h-11"
            onClick={() => setAttempt((current) => current + 1)}
          >
            {t.retry}
          </Button>
        )}
        {items.length > 0 && (
          <ul
            className="m-0 list-none divide-y divide-border p-0"
            aria-label={t.results}
            data-search-results
          >
            {items.map((item, index) => {
              const url = new URL(item.url, location.origin);
              if (url.origin !== location.origin) return null;
              return (
                <li
                  key={`${item.url}-${index}`}
                  className="search-result py-4 first:pt-0"
                  style={{ animationDelay: `${Math.min(index, 8) * 24}ms` }}
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    {item.filters.kind?.includes("projects") ? t.project : t.post}
                  </span>
                  <Heading className="mt-1.5 mb-2 text-xl leading-snug font-semibold">
                    <a className="hover:text-link hover:underline" href={url.pathname + url.hash}>
                      {item.meta.title ?? item.url}
                    </a>
                  </Heading>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {excerptTokens(item.excerpt).map((token, i) =>
                      token.highlight ? (
                        <mark key={i} className="rounded-sm bg-accent px-0.5 text-foreground">
                          {token.text}
                        </mark>
                      ) : (
                        <Fragment key={i}>{token.text}</Fragment>
                      )
                    )}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
        {phase === "ready" && items.length < total && (
          <Button
            variant="outline"
            className="min-h-11"
            disabled={loadingMore}
            onClick={() => void showMore()}
          >
            {loadingMore ? t.searchLoading : t.viewMore}
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-border pt-4 text-base">
        {contentKinds.posts && (
          <a className="text-link" href={localePath(language, "posts")}>
            {t.allPosts} →
          </a>
        )}
        {contentKinds.projects && (
          <a className="text-link" href={localePath(language, "projects")}>
            {t.allProjects} →
          </a>
        )}
        <a className="text-link" href={localePath(language, "tags")}>
          {t.tags} →
        </a>
      </div>
    </div>
  );
}
