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
    path: "/posts",
    title: "Blog",
  },
  {
    path: "/projects",
    title: "Projects",
  },
  {
    path: "/coming-soon?source=about",
    title: "About",
  },
];
