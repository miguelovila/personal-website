import { useMemo, useState } from "react";
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

const networkProfiles = {
  wired: { label: "Wired desk", overhead: 40 },
  cafe: { label: "Cafe Wi-Fi", overhead: 160 },
  train: { label: "Train tether", overhead: 420 },
};

type NetworkProfile = keyof typeof networkProfiles;

export default function LatencyBudget() {
  const [apiMs, setApiMs] = useState(180);
  const [renderMs, setRenderMs] = useState(90);
  const [hydrationMs, setHydrationMs] = useState(120);
  const [network, setNetwork] = useState<NetworkProfile>("cafe");

  const total = useMemo(
    () => apiMs + renderMs + hydrationMs + networkProfiles[network].overhead,
    [apiMs, renderMs, hydrationMs, network]
  );
  const verdict =
    total <= 500 ? "snappy" : total <= 900 ? "fine if the page is useful" : "time to simplify";

  return (
    <section className="my-8 rounded-lg border border-border bg-card p-5 text-card-foreground">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="m-0 text-xl font-semibold">Latency budget sketch</h3>
          <p className="mt-1 text-base text-muted-foreground">
            A fake calculator for testing hydrated controls inside MDX.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setApiMs(180);
            setRenderMs(90);
            setHydrationMs(120);
            setNetwork("cafe");
          }}
        >
          Reset
        </Button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="api-ms">API work</Label>
          <Input
            id="api-ms"
            inputMode="numeric"
            type="number"
            min="0"
            value={apiMs}
            onChange={(event) => setApiMs(Number(event.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="render-ms">Render work</Label>
          <Input
            id="render-ms"
            inputMode="numeric"
            type="number"
            min="0"
            value={renderMs}
            onChange={(event) => setRenderMs(Number(event.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hydration-ms">Hydration work</Label>
          <Input
            id="hydration-ms"
            inputMode="numeric"
            type="number"
            min="0"
            value={hydrationMs}
            onChange={(event) => setHydrationMs(Number(event.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="network-profile">Network</Label>
          <Select value={network} onValueChange={(value) => setNetwork(value as NetworkProfile)}>
            <SelectTrigger id="network-profile" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(networkProfiles).map(([value, profile]) => (
                <SelectItem key={value} value={value}>
                  {profile.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 rounded-md border border-border bg-background p-4">
        <p className="m-0 font-mono text-sm text-muted-foreground">estimated wait</p>
        <p className="m-0 mt-1 text-3xl font-semibold">{total}ms</p>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width]"
            style={{ width: `${Math.min(100, (total / 1200) * 100)}%` }}
          />
        </div>
        <p className="m-0 mt-3 text-base">Verdict: {verdict}.</p>
      </div>
    </section>
  );
}
