import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const root = process.env.SITE_TEST_CONTENT === "1" ? ".test-content" : "src/content";
const loader = (collection: string) =>
  glob({
    pattern: "**/*.{md,mdx}",
    base: `${root}/${collection}`,
    generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, ""),
  });

const common = {
  title: z.string().min(1),
  description: z.string().min(1),
  language: z.enum(["en", "pt"]),
  translationKey: z.string().min(1).optional(),
  draft: z.boolean().default(true),
  publishedDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  featured: z.boolean().default(false),
  tags: z.array(z.string().min(1)).default([]),
};

const projects = defineCollection({
  loader: loader("projects"),
  schema: ({ image }) =>
    z
      .object({
        ...common,
        status: z.enum(["completed", "in-progress", "archived"]),
        technologies: z.array(z.string().min(1)).default([]),
        featuredOrder: z.number().int().nonnegative().optional(),
        repositoryUrl: z.string().url().optional(),
        liveUrl: z.string().url().optional(),
        coverImage: image().optional(),
        coverImageAlt: z.string().min(1).optional(),
        shareImage: image()
          .refine(
            (asset) => asset.format !== "svg",
            "Use a raster sharing image, such as PNG or JPEG."
          )
          .optional(),
        gallery: z
          .array(
            z.object({
              image: image(),
              alt: z.string().min(1),
              caption: z.string().optional(),
            })
          )
          .default([]),
      })
      .refine((data) => !data.coverImage || !!data.coverImageAlt, {
        message: "A cover image needs coverImageAlt.",
        path: ["coverImageAlt"],
      })
      .refine((data) => !data.updatedDate || data.updatedDate >= data.publishedDate, {
        message: "updatedDate cannot precede publishedDate.",
        path: ["updatedDate"],
      }),
});

const posts = defineCollection({
  loader: loader("posts"),
  schema: ({ image }) =>
    z
      .object({
        ...common,
        author: z.string().default("Miguel Vila"),
        coverImage: image().optional(),
        coverImageAlt: z.string().min(1).optional(),
        shareImage: image()
          .refine(
            (asset) => asset.format !== "svg",
            "Use a raster sharing image, such as PNG or JPEG."
          )
          .optional(),
        relatedProjects: z.array(reference("projects")).default([]),
      })
      .refine((data) => !data.coverImage || !!data.coverImageAlt, {
        message: "A cover image needs coverImageAlt.",
        path: ["coverImageAlt"],
      })
      .refine((data) => !data.updatedDate || data.updatedDate >= data.publishedDate, {
        message: "updatedDate cannot precede publishedDate.",
        path: ["updatedDate"],
      }),
});

export const collections = { projects, posts };
