import { Layout } from "@/components/layout";
import { Hero } from "@/components/sections/hero";
import About from "@/components/sections/about";

export default function Home() {
  return (
    <Layout className="flex flex-col">
      <Hero />
      <About />
    </Layout>
  );
}
