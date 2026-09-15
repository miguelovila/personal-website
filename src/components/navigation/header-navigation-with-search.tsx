import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SearchPanel, { type SearchContentKinds } from "@/components/search/search-panel";
import { copy } from "@/lib/i18n";
import HeaderNavigation, { type HeaderNavigationProps } from "./header-navigation";

interface Props extends HeaderNavigationProps {
  hasContent: boolean;
  contentKinds: SearchContentKinds;
}

export default function HeaderNavigationWithSearch({ hasContent, contentKinds, ...props }: Props) {
  const t = copy[props.language];
  const description =
    contentKinds.posts && contentKinds.projects
      ? t.searchDescription
      : contentKinds.posts
        ? t.searchDescriptionPosts
        : t.searchDescriptionProjects;
  const [searchOpen, setSearchOpen] = useState(false);
  const searchTrigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, []);

  const searchAction = (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogTrigger asChild>
        <Button
          ref={searchTrigger}
          variant="ghost"
          size="icon"
          className="size-11"
          aria-label={t.search}
          title={t.search}
          data-open-search
        >
          <Search className="size-[20px]" strokeWidth={1.75} />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] grid-cols-1 gap-6 overflow-y-auto p-[min(1.25rem,5vw)] sm:max-w-2xl sm:p-7"
        showCloseButton={false}
        data-search-dialog
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          document
            .querySelector<HTMLInputElement>("[data-search-dialog] [data-search-input]")
            ?.focus();
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          searchTrigger.current?.focus();
        }}
      >
        <DialogHeader className="min-w-0 pr-[44px] text-left wrap-anywhere">
          <DialogTitle className="text-xl sm:text-2xl">{t.search}</DialogTitle>
          <DialogDescription className="sr-only">{description}</DialogDescription>
        </DialogHeader>
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-[12px] right-[12px] size-[44px]"
            aria-label={t.close}
          >
            <X className="size-[18px]" strokeWidth={1.75} />
          </Button>
        </DialogClose>
        <SearchPanel
          language={props.language}
          hasContent={hasContent}
          contentKinds={contentKinds}
          modal
        />
      </DialogContent>
    </Dialog>
  );

  return (
    <HeaderNavigation
      {...props}
      beforePreferences={searchAction}
      focusFallbackRef={searchTrigger}
    />
  );
}
