type Route = {
  path: string;
  title: string;
  description?: string;
  children?: Route[];
};

export const routes: Route[] = [
  {
    path: "/",
    title: "Home",
  },
  {
    path: "/about",
    title: "About",
  },
  {
    path: "/comming-soon?source=projects",
    title: "Projects",
  },
  {
    path: "/comming-soon?source=blog",
    title: "Blog",
  },
  {
    path: "/comming-soon?source=contact",
    title: "Contact",
  },
];
