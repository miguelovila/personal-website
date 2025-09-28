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
    path: "/coming-soon?source=about",
    title: "About",
  },
  {
    path: "/projects",
    title: "Projects",
  },
  {
    path: "/coming-soon?source=blog",
    title: "Blog",
  },
  {
    path: "/coming-soon?source=contact",
    title: "Contact",
  },
];
