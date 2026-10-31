import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { absolute } from '@/lib/seo';

const FALLBACK_DATE = '2026-10-26';

export const GET: APIRoute = async () => {
  const pages = await getCollection('pages');

  const entries = [
    ...pages.map((entry) => ({
      loc: absolute(entry.data.route),
      lastmod: entry.data.updated?.toISOString().slice(0, 10) ?? FALLBACK_DATE,
      changefreq: entry.data.kind === 'home' ? 'weekly' : 'monthly',
      priority: entry.data.kind === 'home' ? '1.0' : '0.8',
    })),
    {
      loc: absolute('/contact/'),
      lastmod: FALLBACK_DATE,
      changefreq: 'monthly',
      priority: '0.7',
    },
    {
      loc: absolute('/mortgage/'),
      lastmod: FALLBACK_DATE,
      changefreq: 'monthly',
      priority: '0.8',
    },
    {
      loc: absolute('/blog/'),
      lastmod: FALLBACK_DATE,
      changefreq: 'weekly',
      priority: '0.7',
    },
  ].sort((a, b) => a.loc.localeCompare(b.loc));

  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

