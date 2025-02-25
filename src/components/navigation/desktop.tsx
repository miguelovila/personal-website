import * as React from "react";
import NextLink from "next/link";

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
} from "@/components/ui/navigation-menu";

const DesktopNavigationMenu = () => (
  <NavigationMenu>
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

export default DesktopNavigationMenu;
