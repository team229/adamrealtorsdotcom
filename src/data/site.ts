/**
 * Single source of truth for the site's content.
 * Mirrors the content model used by the original adamtherealtor.com build.
 */

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavGroup extends NavItem {
  items: NavItem[];
}

export interface SocialLink {
  label: string;
  href: string;
  bg: string;
  icon: 'instagram' | 'x' | 'facebook' | 'linkedin' | 'youtube';
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface ContactMethod {
  id: string;
  icon: 'phone' | 'mail' | 'map-pin';
  label: string;
  value: string;
  detail: string;
  href: string;
}

export const site = {
  name: 'Adam the Realtor',
  url: 'https://adamtherealtor.com',
  agentName: 'Adam',
  agentFullName: 'Adam Shaaban',
  agentTitle: 'Southern California Realtor',
  agentBio: [
    "I'm Adam Shaban, a real estate agent at Century 21. I'm here to help you through every step of the way and will work with you to make sure the home buying/selling process is great and successful.",
    'I was born in Jordan and grew up in the Emirates. I have been living in Southern California since 2007.',
    'I have been in sales for more than 10 years and am known for my professionalism, deep knowledge, and negotiation skills.',
    "I'm here to help you through every step of the way and will work with you to make sure the home buying/selling process is great and successful.",
  ],
  phone: '323-707-2707',
  phoneHref: 'tel:+13237072707',
  email: 'Adam.shaaban@c21affiliated.com',
  address: '5241 E. Santa Ana Canyon Rd, Suite 100 Anaheim, CA 92807',
  dre: 'DRE #02254921',
  brokerage: 'Century 21 Affiliated',
  portrait: '/images/adam-portrait.png',
} as const;

/** Primary navigation with dropdown menus. */
export const nav: NavGroup[] = [
  {
    label: 'Buy',
    href: '/buy',
    items: [
      {
        label: 'Search Homes',
        href: 'https://adamshaaban.sites.c21.homes/search/#status=active&sold_days=180&pstatus=1%2C11&ls_conversion=acres&location_search_field=300%20E%20Commonwealth%20Ave%2C%20Fullerton%2C%20CA%2092832%2C%20USA&drive_time=09%3A00&drive_duration=15&drive_avoid_ferry=1&drive_departure=1&ss_locale=en-US&ss_email_freq=40&ss_send_zero_result=1&center_lat=33.87040629619043&center_lon=-117.91992655659988&center_lat_pan=33.87040629619043&center_lon_pan=-117.91992655659988&geotype=circle&pgsize=20&startidx=0&sort_by=1&company_uuid=19637992&commute=0&buffer_miles=1&geospatial=true&agent_uuid=a22c6308-ef0b-4be8-8764-be65c7effe93&ptype=1%2C2%2C3%2C4%2C5%2C7%2C9%2C8&searchType=criteria&omit_hidden=true&ex_pend=true&currency=USD',
        external: true,
      },
      { label: 'Investor Calculator', href: '/tools/investor' },
      { label: 'Rent vs Buy Calculator', href: '/mortgage/rent-vs-buy' },
      { label: 'Home Affordability Calculator', href: '/mortgage/affordability' },
      { label: 'Market Report', href: '/market-report' },
    ],
  },
  {
    label: 'Sell',
    href: '/sell',
    items: [
      {
        label: 'Get a Home Value Estimate',
        href: 'https://app.cloudcma.com/api_widget/806ed06610f9789526ca7ec97a55a11d/show?post_url=https://app.cloudcma.com&source_url=ua',
        external: true,
      },
      { label: 'Net Proceeds Calculator', href: '/sell/proceeds' },
      { label: 'Request a Consultation', href: '/contact' },
    ],
  },
  {
    label: 'Get a Mortgage',
    href: '/mortgage',
    items: [
      { label: 'Estimate Your Mortgage Payment', href: '/mortgage/calculator' },
      { label: 'Affordability Calculator', href: '/mortgage/affordability' },
      { label: 'Closing Costs Calculator', href: '/mortgage/closing-costs' },
    ],
  },
];

export const neighborhoodNewsHref =
  'https://engage.century21.com/neighborhood_news/page?agent_uuid=a22c6308-ef0b-4be8-8764-be65c7effe93&status=active&days=30&from_email=false&ptype=1%2C2%2C3%2C4%2C5%2C7%2C9';

export const homeValuationHref =
  'https://app.cloudcma.com/api_widget/806ed06610f9789526ca7ec97a55a11d/show?post_url=https://app.cloudcma.com&source_url=ua';

export const searchHomesHref =
  'https://adamshaaban.sites.c21.homes/search/#status=active&sold_days=180&pstatus=1%2C11&ls_conversion=acres&location_search_field=300%20E%20Commonwealth%20Ave%2C%20Fullerton%2C%20CA%2092832%2C%20USA&drive_time=09%3A00&drive_duration=15&drive_avoid_ferry=1&drive_departure=1&ss_locale=en-US&ss_email_freq=40&ss_send_zero_result=1&center_lat=33.87040629619043&center_lon=-117.91992655659988&center_lat_pan=33.87040629619043&center_lon_pan=-117.91992655659988&geotype=circle&pgsize=20&startidx=0&sort_by=1&company_uuid=19637992&commute=0&buffer_miles=1&geospatial=true&agent_uuid=a22c6308-ef0b-4be8-8764-be65c7effe93&ptype=1%2C2%2C3%2C4%2C5%2C7%2C9%2C8&searchType=criteria&omit_hidden=true&ex_pend=true&currency=USD';

/** Social profiles rendered in the footer. */
export const socials: SocialLink[] = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/adam.socal.realtor/',
    bg: '#E1306C',
    icon: 'instagram',
  },
  { label: 'X', href: 'https://x.com', bg: '#000000', icon: 'x' },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61578765337089',
    bg: '#1877F2',
    icon: 'facebook',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/osama-adam-shaban-310b06201',
    bg: '#0A66C2',
    icon: 'linkedin',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@adam.realestate-agent',
    bg: '#FF0000',
    icon: 'youtube',
  },
];

export const contact = {
  meta: {
    title: 'Contact Adam Shaaban — Southern California REALTOR | Century 21 Affiliated',
    description:
      "Get in touch with Adam Shaaban. Whether you're buying, selling, investing, or just have questions about Southern California real estate — I'm here to help. Free consultation, no pressure.",
    ogImage: 'https://adamtherealtor.com/airo-assets/images/pages/contact/adam-portrait',
  },
  hero: {
    badge: "Let's Talk",
    headline: "I'm Here to Help",
    subheadline:
      "Whether you're buying, selling, or just have a question, send me your information below and I'll personally get back to you.",
  },
  formTitle: 'Send us a Message and will get back ASAP',
  promise: {
    title: 'My Promise',
    body: 'I personally respond to every inquiry within 2 hours during business hours. No bots, no assistants — just me.',
    facts: [
      { id: 'pf1', label: 'Response time', value: 'Under 2 hrs' },
      { id: 'pf2', label: 'Office hours', value: 'Mon–Sat, 8am–7pm PT' },
      { id: 'pf3', label: 'Availability', value: 'Accepting new clients' },
    ],
  },
  socialProof: {
    responseTime: '< 2 hrs',
    satisfactionRate: '98%',
    clientsHelped: '500+',
    yearsInSoCal: '12+',
  },
  stats: [
    { value: '< 2 hrs', label: 'Avg. response time' },
    { value: '98%', label: 'Client satisfaction' },
    { value: '500+', label: 'Clients helped' },
    { value: '12+', label: 'Years in SoCal' },
  ],
  contactMethods: [
    {
      id: 'cm1',
      icon: 'phone',
      label: 'Call or Text',
      value: '323-707-2707',
      detail: 'Call or text Adam directly',
      href: 'tel:+13237072707',
    },
    {
      id: 'cm2',
      icon: 'mail',
      label: 'Email',
      value: 'Adam.shaaban@c21affiliated.com',
      detail: 'Send Adam a message anytime',
      href: 'mailto:Adam.shaaban@c21affiliated.com',
    },
    {
      id: 'cm3',
      icon: 'map-pin',
      label: 'Office',
      value: 'Anaheim Hills, California',
      detail: 'Serving Southern California',
      href: '#',
    },
  ] satisfies ContactMethod[],
  inquiryTypes: [
    { id: 'iq1', label: 'I want to buy a home' },
    { id: 'iq2', label: 'I want to sell my home' },
    { id: 'iq3', label: "I'm an investor" },
    { id: 'iq4', label: 'I want to rent' },
    { id: 'iq5', label: 'I have a general question' },
  ],
  faqs: [
    {
      id: 'faq1',
      question: 'How quickly do you respond?',
      answer:
        'I personally respond to every message within 2 hours during business hours (Mon–Sat, 8am–7pm PT). For urgent matters, call or text directly.',
    },
    {
      id: 'faq2',
      question: 'Is the initial consultation really free?',
      answer:
        "Absolutely. There's no cost, no obligation, and no pressure. I believe in earning your trust before asking for your business.",
    },
    {
      id: 'faq3',
      question: 'Do you work with first-time buyers?',
      answer:
        "Yes — first-time buyers are some of my favorite clients. I'll walk you through every step, explain everything clearly, and make sure you feel confident at closing.",
    },
    {
      id: 'faq4',
      question: 'How much should I budget for a down payment and closing costs?',
      answer:
        'Your upfront costs depend on your loan program, purchase price, and available assistance. Adam can help you compare realistic down-payment options, estimate closing costs, and plan a comfortable monthly payment before you start touring homes.',
    },
    {
      id: 'faq5',
      question: 'Should I get pre-approved before I start looking at homes?',
      answer:
        'Yes. A pre-approval helps you understand your buying range, strengthens your offer, and lets you move quickly when the right home appears. Adam can help you prepare for the process and connect you with trusted lending resources.',
    },
    {
      id: 'faq6',
      question: 'How do you determine what my home is worth?',
      answer:
        "Adam reviews recent comparable sales, your home's condition and features, local buyer demand, and current competition. You will receive a clear pricing strategy designed to attract qualified buyers while protecting your goals.",
    },
    {
      id: 'faq7',
      question: 'What should I do before listing my home for sale?',
      answer:
        'Start with a walkthrough and pricing consultation. Adam will help you prioritize repairs, staging, photography, timing, and marketing so you can focus on the updates most likely to improve your sale outcome.',
    },
    {
      id: 'faq8',
      question: 'Can I buy a new home before selling my current one?',
      answer:
        'Often, yes. The best approach depends on your equity, financing, timeline, and comfort with risk. Adam can help you compare sale-first, buy-first, and contingency strategies so you can make a confident plan.',
    },
  ] satisfies Faq[],
  notReady: {
    title: 'Not ready to reach out yet?',
    body: "Explore the tools and resources below — and come back when you're ready. I'll be here.",
    tools: [
      {
        id: 't1',
        icon: 'home',
        title: 'Get My Home Value',
        body: 'Get an instant, data-driven estimate for your Southern California home.',
        href: homeValuationHref,
        external: true,
      },
      {
        id: 't2',
        icon: 'calculator',
        title: 'Browse Tools',
        body: 'Affordability, rent vs. buy, and investor calculators to plan your move.',
        href: '/tools/investor',
      },
      {
        id: 't3',
        icon: 'trending-up',
        title: 'Investment Guide',
        body: 'Neighborhood insights and market data to sharpen your next decision.',
        href: '/market-report',
      },
    ],
  },
};

export const footerLinks = {
  buy: [
    { label: 'Search Homes', href: searchHomesHref, external: true },
    { label: 'Investor Calculator', href: '/tools/investor' },
    { label: 'Rent vs Buy Calculator', href: '/mortgage/rent-vs-buy' },
    { label: 'Home Affordability Calculator', href: '/mortgage/affordability' },
  ],
  sell: [
    { label: 'Get a Home Value Estimate', href: homeValuationHref, external: true },
    { label: 'Net Proceeds Calculator', href: '/sell/proceeds' },
    { label: 'Request a Consultation', href: '/contact' },
    { label: 'Market Report', href: '/market-report' },
    { label: 'Neighborhood News', href: neighborhoodNewsHref, external: true },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Accessibility', href: '/accessibility' },
  ],
};
