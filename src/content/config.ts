import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        publishedDate: z.date(),
        updatedDate: z.date().optional(),
        status: z.enum(['completed', 'in-progress', 'archived']),
        featured: z.boolean().default(false),

        technologies: z.array(z.string()),
        category: z.string(),
        repositoryUrl: z.string().url().optional(),
        liveUrl: z.string().url().optional(),

        coverImage: z.string().optional(),
        gallery: z.array(z.string()).optional(),

        tags: z.array(z.string()).optional(),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    })
});

const postsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        publishedDate: z.date(),
        updatedDate: z.date().optional(),
        featured: z.boolean().default(false),

        coverImage: z.string().optional(),
        author: z.string().default('Miguel Vila'),

        tags: z.array(z.string()).optional(),
        category: z.string().optional(),
    })
});

export const collections = {
    projects: projectsCollection,
    posts: postsCollection,
};