import { type ReactNode, type RefObject, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeMenu from "./theme-menu";
import { navigationRoutes, activeRoute } from "./routes";
import { copy } from "@/lib/i18n";
import { localePath, type Language } from "@/lib/publishing";
import type { Alternate } from "@/lib/content";

export interface HeaderNavigationProps {
  language: Language;
  alternates: Alternate[];
  fallbackPath?: string;
  current: string;
  routes?: { path: string; title: string }[];
  beforePreferences?: ReactNode;
  focusFallbackRef?: RefObject<HTMLButtonElement | null>;
}
function LanguageLinks({
  language,
  alternates,
  fallbackPath = "/",
}: Pick<HeaderNavigationProps, "language" | "alternates" | "fallbackPath">) {
  const other = language === "en" ? "pt" : "en";
  const translation = alternates.find((item) => item.language === other);
  return (
    <div className="language-links" role="group" aria-label={copy[language].language}>
      <span aria-current="true">{language.toUpperCase()}</span>
      <span className="language-divider" aria-hidden="true">
        /
      </span>
      <a
        href={translation?.href ?? localePath(other, fallbackPath)}
        lang={other === "pt" ? "pt-PT" : "en"}
        hrefLang={other === "pt" ? "pt-PT" : "en"}
        aria-label={
          translation
            ? other === "pt"
              ? "Ler em português"
              : "Read in English"
            : copy[language].untranslated
        }
        title={
          translation ? (other === "pt" ? "Português" : "English") : copy[language].untranslated
        }
      >
        {other.toUpperCase()}
      </a>
    </div>
  );
}

export default function HeaderNavigation(props: HeaderNavigationProps) {
  const { language, current, routes = navigationRoutes(language), beforePreferences } = props;
  const t = copy[language];
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const desktop = useRef<HTMLElement>(null);
  const showMenu = routes.length > 1;

  useEffect(() => {
    if (!showMenu) return;
    const media = matchMedia("(min-width: 1024px)");
    const change = () => {
      if (media.matches) setMenuOpen(false);
      else if (desktop.current?.contains(document.activeElement)) menuTrigger.current?.focus();
    };
    media.addEventListener("change", change);
    return () => {
      media.removeEventListener("change", change);
    };
  }, [showMenu]);

  return (
    <div
      className="header-navigation"
      data-enhanced-navigation
      data-compact-navigation={!showMenu || undefined}
    >
      {routes.length > 1 && (
        <nav ref={desktop} aria-label={t.navigation} className="desktop-nav">
          {routes.map((route) => (
            <a
              key={route.path}
              href={route.path}
              aria-current={activeRoute(current, route.path, language) ? "page" : undefined}
            >
              {route.title}
            </a>
          ))}
        </nav>
      )}
      <div className="header-actions">
        {beforePreferences}
        <div className="desktop-preferences">
          <LanguageLinks {...props} />
          <ThemeMenu language={language} />
        </div>
        {showMenu && (
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                ref={menuTrigger}
                variant="ghost"
                className="mobile-nav-trigger h-11 gap-2 px-2 text-base"
              >
                <span>{t.menu}</span>
                <Menu className="size-[18px]" strokeWidth={1.75} />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="top"
              showCloseButton={false}
              className="max-h-[90dvh] gap-0 overflow-y-auto p-5 sm:px-10"
              data-mobile-navigation
              onCloseAutoFocus={(event) => {
                event.preventDefault();
                (menuTrigger.current?.getClientRects().length
                  ? menuTrigger.current
                  : props.focusFallbackRef?.current
                )?.focus();
              }}
            >
              <SheetHeader className="px-0 pt-0 pb-4">
                <SheetTitle className="text-xl">{t.menu}</SheetTitle>
                <SheetDescription className="sr-only">{t.navigation}</SheetDescription>
              </SheetHeader>
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 size-11"
                  aria-label={t.close}
                >
                  <X className="size-[18px]" />
                </Button>
              </SheetClose>
              <nav aria-label={t.navigation} className="flex flex-col">
                {routes.map((route) => (
                  <SheetClose key={route.path} asChild>
                    <a
                      className="flex min-h-14 items-center border-b border-border text-lg hover:text-link aria-[current=page]:text-link"
                      href={route.path}
                      aria-current={activeRoute(current, route.path, language) ? "page" : undefined}
                    >
                      {route.title}
                    </a>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <LanguageLinks {...props} />
                <ThemeMenu language={language} />
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
}
