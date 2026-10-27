import { cityPages, site, socials } from '@/data/site';

export const ORGANIZATION_ID = `${site.url}/#organization`;
export const WEBSITE_ID = `${site.url}/#website`;

export interface Crumb {
  name: string;
  href: string;
}

export function absolute(path: string): string {
  return new URL(path, site.url).href;
}

/** Core RealEstateAgent entity shared by every page. */
export function agentSchema(cities: string[] = cityPages.map((city) => city.name)) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': ORGANIZATION_ID,
    name: site.agentFullName,
    alternateName: site.name,
    url: absolute('/'),
    image: absolute(site.portrait),
    telephone: '+1-323-707-2707',
    email: site.email,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '5241 E. Santa Ana Canyon Rd, Suite 100',
      addressLocality: 'Anaheim',
      addressRegion: 'CA',
      postalCode: '92807',
      addressCountry: 'US',
    },
    areaServed: cities.map((name) => ({ '@type': 'City', name })),
    knowsAbout: [
      'Residential real estate',
      'Home buying',
      'Home selling',
      'Real estate investing',
      'Orange County real estate',
    ],
    parentOrganization: { '@type': 'Organization', name: site.brokerage },
    sameAs: socials.map((social) => social.href),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: site.name,
    url: absolute('/'),
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-US',
  };
}

interface WebPageInput {
  url: string;
  name: string;
  description: string;
  type?: 'WebPage' | 'AboutPage' | 'CollectionPage';
  updated?: Date;
  city?: string;
}

export function webPageSchema({ url, name, description, type = 'WebPage', updated, city }: WebPageInput) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-US',
  };

  if (updated) schema.dateModified = updated.toISOString().slice(0, 10);
  if (city) {
    schema.contentLocation = {
      '@type': 'City',
      name: city,
      containedInPlace: { '@type': 'AdministrativeArea', name: 'Orange County, California' },
    };
  }

  return schema;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${absolute(crumbs[crumbs.length - 1].href)}#breadcrumb`,
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absolute(crumb.href),
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[], url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}

export function serviceSchema({
  name,
  description,
  url,
  serviceType,
  cities,
}: {
  name: string;
  description: string;
  url: string;
  serviceType: string;
  cities: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name,
    description,
    serviceType,
    url,
    provider: { '@id': ORGANIZATION_ID },
    areaServed: cities.map((city) => ({ '@type': 'City', name: city })),
  };
}
