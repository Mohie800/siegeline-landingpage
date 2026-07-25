import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * The four documents Google Play needs. One folder per language; ids come out as
 * "en/privacy", "ar/privacy", … and the routes split on that prefix.
 */
const legal = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/data/legal' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** ISO date shown as "Last updated" — bump it whenever the text changes. */
    updated: z.string(),
  }),
});

export const collections = { legal };
