import NextLink from "next/link";

import { LuMenu } from "react-icons/lu";

import { routes } from "@/data";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigationMobileMenuTriggerStyle } from "@/components/ui/navigation-menu";

const MobileNavigationMenu = () => (
  <div className="md:hidden">
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <LuMenu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-[200px] flex-col items-center justify-center gap-2">
        <SheetHeader>
          <SheetTitle className="hidden">Mobile Navigation Bar</SheetTitle>
        </SheetHeader>
        {routes.map((route) => (
          <NextLink
            href={route.path}
            key={route.path}
            rel="noopener noreferrer"
            aria-label={route.title}
            className={navigationMobileMenuTriggerStyle()}
          >
            {route.title}
          </NextLink>
        ))}
      </SheetContent>
    </Sheet>
  </div>
);

export default MobileNavigationMenu;
