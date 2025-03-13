import { Layout } from "@/components/layout";
import { Typography } from "@/components/typography";
import NextLink from "next/link";
import Image from "next/image";

import { contacts } from "@/data";
import { Hero } from "@/components/sections/hero";
import About from "@/components/sections/about";

export default function Home() {
  return (
    <Layout className="flex flex-col space-y-8">
      <Hero />
      <About />
    </Layout>
  );
}
