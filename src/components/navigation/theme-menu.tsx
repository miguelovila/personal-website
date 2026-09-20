import { ChevronDown, Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { copy } from "@/lib/i18n";
import type { Language } from "@/lib/publishing";
import { setTheme, useTheme, type ThemePreference } from "@/lib/theme";

export default function ThemeMenu({ language }: { language: Language }) {
  const t = copy[language];
  const theme = useTheme();
  const options = {
    light: { label: t.light, Icon: Sun },
    dark: { label: t.dark, Icon: Moon },
    system: { label: t.system, Icon: Monitor },
  };
  const selected = options[theme];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="gap-2 px-2"
          aria-label={`${t.appearance}: ${selected.label}`}
          data-theme-trigger
        >
          <selected.Icon className="size-4" strokeWidth={1.75} />
          <span>{selected.label}</span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-44 max-w-[calc(100vw-2rem)]"
        aria-label={t.appearance}
      >
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as ThemePreference)}
        >
          {Object.entries(options).map(([value, { label, Icon }]) => (
            <DropdownMenuRadioItem key={value} value={value} className="gap-2">
              <Icon className="size-4" strokeWidth={1.75} />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
