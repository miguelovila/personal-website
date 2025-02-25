import Logo from "@/components/navigation/nav-logo";
import { ThemeSwitcher } from "../ui/theme-switcher";
import { Separator } from "@/components/ui/separator";
import MobileNavigationMenu from "@/components/navigation/mobile";
import DesktopNavigationMenu from "@/components/navigation/desktop";

const Shortcuts = () => (
  <>
    <ThemeSwitcher />
  </>
);

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex w-full flex-row justify-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between border-l border-r p-2">
        <Logo />
        <DesktopNavigationMenu />
        <div className="flex h-full items-center gap-2">
          <Shortcuts />
          <Separator orientation="vertical" className="h-2/3 md:hidden" />
          <MobileNavigationMenu />
        </div>
      </div>
    </header>
  );
};
