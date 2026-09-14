import { useId, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { copy } from "@/lib/i18n";
import type { Language } from "@/lib/publishing";

export default function ProjectFilter({
  language,
  technologies,
  total,
}: {
  language: Language;
  technologies: string[];
  total: number;
}) {
  const t = copy[language];
  const id = useId();
  const [value, setValue] = useState("all");
  const [count, setCount] = useState(total);
  const filter = (next: string) => {
    setValue(next);
    let visible = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelectorAll<HTMLElement>("[data-project]").forEach((project) => {
      const values: string[] = JSON.parse(project.dataset.technologies ?? "[]");
      const shouldShow = next === "all" || values.includes(next);
      const timer = Number(project.dataset.filterTimer);
      if (timer) window.clearTimeout(timer);
      if (shouldShow) {
        project.hidden = false;
        project.removeAttribute("aria-hidden");
        project.dataset.filterState = "hidden";
        window.requestAnimationFrame(() => {
          project.dataset.filterState = "visible";
        });
        visible++;
        return;
      }
      project.dataset.filterState = "hidden";
      project.setAttribute("aria-hidden", "true");
      if (reduceMotion) {
        project.hidden = true;
        return;
      }
      const hideTimer = window.setTimeout(() => {
        if (project.dataset.filterState === "hidden") project.hidden = true;
      }, 180);
      project.dataset.filterTimer = String(hideTimer);
    });
    setCount(visible);
    const empty = document.querySelector<HTMLElement>("[data-project-empty]");
    if (empty) {
      empty.dataset.filterState = visible > 0 ? "hidden" : "visible";
      empty.hidden = visible > 0;
    }
  };
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3" data-project-filter-control>
        <Label htmlFor={id}>{t.technologies}</Label>
        <Select value={value} onValueChange={filter}>
          <SelectTrigger id={id} className="w-48 max-w-full" data-project-filter>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" align="start">
            <SelectItem value="all">{t.all}</SelectItem>
            {technologies.map((technology) => (
              <SelectItem key={technology} value={technology}>
                {technology}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <span role="status" className="text-base text-muted-foreground" data-project-count>
        {count} {count === 1 ? t.projectCountOne : t.projectCount}
      </span>
    </div>
  );
}
