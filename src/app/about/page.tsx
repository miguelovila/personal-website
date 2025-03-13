import { Layout } from "@/components/layout";
import { About } from "@/components/sections/about";

export default function AboutSection() {
  return (
    <Layout className="flex flex-col items-center justify-center">
      <About />
    </Layout>
  );
}
