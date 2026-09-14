import { useMemo, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const accents = {
  orange: { label: "Orange", color: "#ff8214" },
  moss: { label: "Moss", color: "#67b26f" },
  sky: { label: "Sky", color: "#67a7ff" },
};

const surfaces = {
  ink: { label: "Ink", background: "#17110d", foreground: "#f8efe7" },
  paper: { label: "Paper", background: "#fff8f0", foreground: "#211812" },
};

type Accent = keyof typeof accents;
type Surface = keyof typeof surfaces;

export default function ThemeTokenPlayground() {
  const [accent, setAccent] = useState<Accent>("orange");
  const [surface, setSurface] = useState<Surface>("ink");

  const style = useMemo(
    () => ({
      "--demo-accent": accents[accent].color,
      "--demo-bg": surfaces[surface].background,
      "--demo-fg": surfaces[surface].foreground,
    }),
    [accent, surface]
  );

  return (
    <section
      className="my-8 rounded-lg border border-border bg-card p-5 text-card-foreground"
      style={style as CSSProperties}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="m-0 text-xl font-semibold">Theme token playground</h3>
          <p className="mt-1 text-base text-muted-foreground">
            A fake design probe for checking selects, focus rings, and swatches.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="demo-accent">Accent</Label>
            <Select value={accent} onValueChange={(value) => setAccent(value as Accent)}>
              <SelectTrigger id="demo-accent" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(accents).map(([value, token]) => (
                  <SelectItem key={value} value={value}>
                    {token.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-surface">Surface</Label>
            <Select value={surface} onValueChange={(value) => setSurface(value as Surface)}>
              <SelectTrigger id="demo-surface" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(surfaces).map(([value, token]) => (
                  <SelectItem key={value} value={value}>
                    {token.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-md border border-border bg-[var(--demo-bg)] p-4 text-[var(--demo-fg)]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="size-10 rounded-full bg-[var(--demo-accent)]" aria-hidden="true" />
          <div>
            <p className="m-0 text-lg font-semibold">Sample card with live tokens</p>
            <p className="m-0 text-sm opacity-75">
              Useful enough for testing, fake enough to delete.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button type="button" style={{ backgroundColor: accents[accent].color }}>
            Primary
          </Button>
          <Button type="button" variant="outline">
            Quiet action
          </Button>
        </div>
      </div>
    </section>
  );
}
