import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { copy } from "@/lib/i18n";
import type { Language } from "@/lib/publishing";

interface Props {
  language: Language;
}

interface SelectedImage {
  src: string;
  alt: string;
  caption: string;
}

export default function ImageDialog({ language }: Props) {
  const t = copy[language];
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<SelectedImage | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    // Markdown images share the viewer used by covers, figures, and galleries.
    const description = document.createElement("textarea");
    document.querySelectorAll<HTMLImageElement>(".prose img").forEach((thumbnail) => {
      if (thumbnail.closest("a, button")) return;
      // Astro's Markdown images can retain HTML entities in their alt attributes.
      description.innerHTML = thumbnail.alt.replace(/</g, "&lt;");
      thumbnail.alt = description.value;
      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "image-modal-trigger";
      trigger.dataset.imageOpen = "";
      trigger.setAttribute("aria-label", `${t.imageOpen}: ${thumbnail.alt}`);
      trigger.setAttribute("aria-haspopup", "dialog");
      thumbnail.replaceWith(trigger);
      trigger.append(thumbnail);
    });

    document.addEventListener(
      "click",
      (event) => {
        if (!(event.target instanceof Element)) return;
        const trigger = event.target.closest<HTMLElement>("[data-image-open]");
        if (!trigger || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        const thumbnail = trigger.querySelector("img");
        if (!thumbnail) return;
        event.preventDefault();
        triggerRef.current = trigger;
        setImage({
          src:
            trigger instanceof HTMLAnchorElement
              ? trigger.href
              : thumbnail.currentSrc || thumbnail.src,
          alt: thumbnail.alt,
          caption:
            trigger.closest("figure")?.querySelector("figcaption")?.textContent?.trim() ||
            thumbnail.alt,
        });
        setOpen(true);
      },
      { signal }
    );

    document.addEventListener(
      "astro:before-swap",
      () => {
        triggerRef.current = null;
        // Release the portal and scroll lock before Astro replaces the document body.
        flushSync(() => {
          setOpen(false);
          setImage(null);
        });
      },
      { signal }
    );

    return () => controller.abort();
  }, [t.imageOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {image && (
        <DialogContent
          className="max-h-[calc(100dvh-2rem)] w-max max-w-[calc(100vw-2rem)] gap-0 overflow-y-auto p-4 pt-12 sm:max-w-[min(1400px,calc(100vw-4rem))]"
          closeLabel={t.close}
          data-image-dialog
          data-pagefind-ignore
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            triggerRef.current?.focus({ preventScroll: true });
          }}
        >
          <DialogTitle className="sr-only">{t.imagePreview}</DialogTitle>
          <figure className="grid min-w-0 justify-items-center gap-3">
            <img
              src={image.src}
              alt={image.alt}
              className="h-auto max-h-[calc(100dvh-12rem)] w-auto max-w-full object-contain"
            />
            <DialogDescription asChild className="max-w-[80ch] text-base leading-6">
              <figcaption>{image.caption}</figcaption>
            </DialogDescription>
          </figure>
        </DialogContent>
      )}
    </Dialog>
  );
}
