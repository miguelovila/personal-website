import { describe, expect, test } from "bun:test";
import {
  chronological,
  dateLabel,
  entrySlug,
  isPublished,
  localePath,
  readingMinutes,
  tagSlug,
} from "../src/lib/publishing";

describe("publication and addresses", () => {
  const now = new Date("2026-01-01T00:00:00Z");
  test("unpublished and future content stays private; publication starts at its timestamp", () => {
    expect(isPublished({ draft: true, publishedDate: new Date("2020-01-01") }, now)).toBe(false);
    expect(
      isPublished({ draft: false, publishedDate: new Date("2026-01-01T00:00:01Z") }, now)
    ).toBe(false);
    expect(isPublished({ draft: false, publishedDate: now }, now)).toBe(true);
  });
  test("language paths preserve English addresses and distinguish feed files", () => {
    expect(localePath("en")).toBe("/");
    expect(localePath("pt")).toBe("/pt/");
    expect(localePath("pt", "/posts/example/")).toBe("/pt/posts/example/");
    expect(localePath("pt", "rss.xml")).toBe("/pt/rss.xml");
    expect(localePath("en", "posts/example")).toBe("/posts/example/");
  });
  test("content filenames cannot collide with archives or escape their locale", () => {
    expect(entrySlug("pt/notas-de-campo")).toBe("notas-de-campo");
    for (const id of ["en/page", "en/index", "../escape", "en/nested/entry", "no-language"]) {
      expect(() => entrySlug(id)).toThrow();
    }
  });
  test("Portuguese accents become stable topic addresses", () => {
    expect(tagSlug("Programação e memória")).toBe("programacao-e-memoria");
    expect(() => tagSlug("***")).toThrow();
  });
  test("dates do not shift backwards across timezones", () => {
    expect(dateLabel(new Date("2024-01-01T00:00:00Z"), "en")).toBe("1 Jan 2024");
    expect(dateLabel(new Date("2024-01-01T00:00:00Z"), "pt")).toContain("2024");
  });
  test("sorting has a stable tie-breaker", () => {
    const data = { publishedDate: now };
    const entries = [
      { id: "en/b", data },
      { id: "en/a", data },
    ];
    expect(entries.sort(chronological).map((entry) => entry.id)).toEqual(["en/a", "en/b"]);
  });
  test("reading time doesn't count markup and fenced code as prose", () => {
    expect(readingMinutes("```js\n" + "long ".repeat(1000) + "\n```\nA short note.")).toBe(1);
    expect(readingMinutes("word ".repeat(401))).toBe(3);
    expect(readingMinutes("")).toBe(1);
  });
});
