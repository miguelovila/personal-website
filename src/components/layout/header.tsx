import Image from "next/image";
import { Typography } from "@/components/typography";
import NextLink from "next/link";
import * as React from "react";
import { routes } from "@/data";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  navigationMobileMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "../ui/theme-switcher";
import { Separator } from "@/components/ui/separator";

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

const Logo = () => (
  <NextLink
    href="/"
    rel="noopener noreferrer"
    aria-label="Home"
    className="flex items-center gap-2"
  >
    <Image
      src="/images/profile-picture-pixelated.png"
      alt="Profile"
      width={60}
      height={60}
      className="size-[30px] rounded-lg"
      priority
    />
    <Typography variant="h1" className="text-primary">
      Miguel Vila
    </Typography>
  </NextLink>
);

const Shortcuts = () => (
  <>
    <ThemeSwitcher />
  </>
);

const DesktopNavigationMenu = () => (
  <NavigationMenu className="hidden md:flex">
    <NavigationMenuList>
      {routes.map((route) => (
        <NavigationMenuItem key={route.path}>
          {route.children ? (
            <>
              <NavigationMenuTrigger>{route.title}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {route.children.map((subroute) => (
                    <ListItem
                      key={subroute.path}
                      title={subroute.title}
                      href={subroute.path}
                    >
                      {subroute.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </>
          ) : (
            <>
              <NextLink
                href={route.path}
                rel="noopener noreferrer"
                aria-label={route.title}
                className={navigationMenuTriggerStyle()}
              >
                {route.title}
              </NextLink>
            </>
          )}
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  </NavigationMenu>
);

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LuMenu } from "react-icons/lu";

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
