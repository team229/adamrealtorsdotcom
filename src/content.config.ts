import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Marketing pages live as Markdown so copy stays out of the templates.
 * `route` is explicit (with a trailing slash) so canonicals, breadcrumbs and
 * the sitemap can never drift from the rendered URL.
 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().max(175),
    h1: z.string(),
    eyebrow: z.string(),
    kind: z.enum(['home', 'about', 'service', 'city', 'legal', 'blog']),
    route: z.string().startsWith('/').endsWith('/'),
    lede: z.string(),
    updated: z.coerce.date().optional(),
    city: z.string().optional(),
    /** Blog only: feature image path under /public and its alt text. */
    image: z.string().optional(),
    image_alt: z.string().optional(),
    /** Blog only: short slug used for listings. */
    slug: z.string().optional(),
    /** Blog only: heading above the FAQ accordion on this post. */
    faq_heading: z.string().optional(),
    /** Blog only: heading above the closing CTA band on this post. */
    cta_heading: z.string().optional(),
    faqs: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .default([]),
  }),
});

export const collections = { pages };
