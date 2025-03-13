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
      <div className="container flex flex-1 items-center gap-2 border-l border-r p-2 lg:justify-between">
        <div className="flex flex-grow basis-0">
          <Logo />
        </div>
        <div className="hidden md:flex">
          <DesktopNavigationMenu />
        </div>
        <Separator
          orientation="vertical"
          className="hidden h-2/3 md:max-lg:block"
        />
        <div className="flex h-full items-center justify-end gap-2 lg:flex-grow lg:basis-0">
          <Shortcuts />
          <Separator orientation="vertical" className="h-2/3 md:hidden" />
          <div className="md:hidden">
            <MobileNavigationMenu />
          </div>
        </div>
      </div>
    </header>
  );
};
