import { useSyncExternalStore } from "react";

export type ThemePreference = "light" | "dark" | "system";
const valid = (value: string | null | undefined): ThemePreference | undefined =>
  value === "light" || value === "dark" || value === "system" ? value : undefined;
const storedPreference = (): ThemePreference => {
  try {
    return valid(localStorage.getItem("theme")) ?? "system";
  } catch {
    return "system";
  }
};
const snapshot = () =>
  valid(document.documentElement.dataset.themePreference) ?? storedPreference();
function apply(preference: ThemePreference) {
  const dark =
    preference === "dark" ||
    (preference === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.themePreference = preference;
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}
function subscribe(notify: () => void) {
  const media = matchMedia("(prefers-color-scheme: dark)");
  const update = () => {
    apply(snapshot());
    notify();
  };
  const storage = (event: StorageEvent) => {
    if (event.key === "theme" || event.key === null) {
      apply(valid(event.newValue) ?? "system");
      notify();
    }
  };
  media.addEventListener("change", update);
  document.addEventListener("astro:after-swap", update);
  window.addEventListener("theme-change", update);
  window.addEventListener("storage", storage);
  update();
  return () => {
    media.removeEventListener("change", update);
    document.removeEventListener("astro:after-swap", update);
    window.removeEventListener("theme-change", update);
    window.removeEventListener("storage", storage);
  };
}
export function setTheme(preference: ThemePreference) {
  apply(preference);
  try {
    localStorage.setItem("theme", preference);
  } catch {
    /* The in-memory preference still works. */
  }
  window.dispatchEvent(new Event("theme-change"));
}
export function useTheme() {
  return useSyncExternalStore(subscribe, snapshot, (): ThemePreference => "system");
}
