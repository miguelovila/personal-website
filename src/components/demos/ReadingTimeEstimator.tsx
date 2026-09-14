import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const sample =
  "A post should earn its length. The first paragraph makes a promise, the middle keeps it honest, and the ending leaves one useful handle for later.";

export default function ReadingTimeEstimator() {
  const [text, setText] = useState(sample);
  const [wordsPerMinute, setWordsPerMinute] = useState(210);

  const stats = useMemo(() => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const minutes = Math.max(1, Math.ceil(words.length / Math.max(1, wordsPerMinute)));
    return { words: words.length, minutes };
  }, [text, wordsPerMinute]);

  return (
    <section className="my-8 rounded-lg border border-border bg-card p-5 text-card-foreground">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="m-0 text-xl font-semibold">Reading time estimator</h3>
          <p className="mt-1 text-base text-muted-foreground">
            A hydrated MDX island with text input, counters, and reset state.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={() => setText(sample)}>
          Reset text
        </Button>
      </div>

      <div className="mt-5 grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="reading-demo-text">Draft text</Label>
          <textarea
            id="reading-demo-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="min-h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        </div>
        <div className="max-w-48 space-y-2">
          <Label htmlFor="words-per-minute">Words per minute</Label>
          <Input
            id="words-per-minute"
            inputMode="numeric"
            type="number"
            min="80"
            value={wordsPerMinute}
            onChange={(event) => setWordsPerMinute(Number(event.target.value) || 1)}
          />
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-border bg-background p-3">
          <dt className="font-mono text-sm text-muted-foreground">words</dt>
          <dd className="m-0 text-2xl font-semibold">{stats.words}</dd>
        </div>
        <div className="rounded-md border border-border bg-background p-3">
          <dt className="font-mono text-sm text-muted-foreground">reading</dt>
          <dd className="m-0 text-2xl font-semibold">{stats.minutes} min</dd>
        </div>
        <div className="rounded-md border border-border bg-background p-3">
          <dt className="font-mono text-sm text-muted-foreground">pace</dt>
          <dd className="m-0 text-2xl font-semibold">{wordsPerMinute}</dd>
        </div>
      </dl>
    </section>
  );
}
