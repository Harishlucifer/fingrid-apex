/**
 * SEO Configuration
 * Default values and site-wide SEO settings for Fingrid.ai
 */

const SITE_URL = 'https://fingrid.ai';

const seoConfig = {
  // Site-wide defaults
  defaults: {
    title: 'Fingrid.ai - Intelligent AI Solutions for Modern Finance',
    description:
      'Empowering businesses with intelligent AI-powered solutions for lending, data services, and technology stacks. Transform your financial operations with Fingrid.ai.',
    image: `${SITE_URL}/logo.png`,
    url: SITE_URL,
    siteName: 'Fingrid.ai',
    locale: 'en_US',
    type: 'website',
    twitterHandle: '@fingridai',
    keywords:
      'Fingrid.ai, AI, lending, fintech, data services, OS Suite, technology stacks, financial technology, loan origination, credit scoring',
  },

  // Per-page SEO overrides (can be used for static route-based lookups)
  pages: {
    '/': {
      title: 'Fingrid.ai - Intelligent AI Solutions for Modern Finance',
      description:
        'Transform your financial operations with Fingrid.ai\'s cutting-edge AI platform. From lending automation to data services, we power the future of fintech.',
      keywords: 'Fingrid.ai, AI, fintech, lending automation, financial technology',
    },
    '/products': {
      title: 'Products - Fingrid.ai',
      description:
        'Explore Fingrid.ai\'s comprehensive product suite including FinGrid Studio, Stacks, OS Suite, Network, and Agentic AI solutions.',
      keywords: 'FinGrid Studio, FinGrid Stacks, FinGrid OS, lending products, fintech solutions',
    },
    '/products/studio': {
      title: 'FinGrid Studio - Fingrid.ai',
      description:
        'FinGrid Studio: A powerful low-code platform for building and deploying financial applications rapidly.',
      keywords: 'low-code platform, financial applications, rapid development, FinGrid Studio',
    },
    '/products/stacks': {
      title: 'FinGrid Stacks - Fingrid.ai',
      description:
        'Modular technology stacks covering Marketing, Sales, Credit, Loan Lifecycle, Collections, and Accounting.',
      keywords: 'lending stacks, loan lifecycle, credit management, collections, accounting',
    },
    '/products/os': {
      title: 'FinGrid OS Suite - Fingrid.ai',
      description:
        'Operating system solutions designed for Lenders, BCs, DSAs, LSPs, Agencies, and Auto Dealers.',
      keywords: 'Lender OS, BC OS, DSA OS, LSP OS, Agency OS, Auto Dealer OS',
    },
    '/products/network': {
      title: 'FinGrid Network - Fingrid.ai',
      description:
        'Connect, discover, and collaborate across the lending ecosystem with FinGrid Network.',
      keywords: 'lending network, partnership network, deal room, lender integration',
    },
    '/products/agentic-ai': {
      title: 'Agentic AI - Fingrid.ai',
      description:
        'AI-powered autonomous agents that transform lending workflows with intelligent automation.',
      keywords: 'agentic AI, autonomous agents, AI lending, intelligent automation',
    },
    '/about': {
      title: 'About Us - Fingrid.ai',
      description:
        'Learn about Fingrid.ai (Inforvio Technologies) — our mission, team, expertise, and the technology powering modern financial institutions.',
      keywords: 'about Fingrid.ai, Inforvio Technologies, fintech company, lending expertise',
    },
    '/contact': {
      title: 'Contact Us - Fingrid.ai',
      description:
        'Get in touch with Fingrid.ai. We\'d love to discuss how our AI-powered solutions can transform your financial operations.',
      keywords: 'contact Fingrid.ai, get in touch, fintech support, demo request',
    },
    '/innovation': {
      title: 'Innovation - Fingrid.ai',
      description:
        'Discover Fingrid.ai\'s innovation initiatives including the University Innovation Network and research partnerships.',
      keywords: 'innovation, university network, research, fintech innovation',
    },
    '/gtm-strategy': {
      title: 'GTM Strategy - Fingrid.ai',
      description:
        'Fingrid.ai\'s go-to-market strategy for scaling AI-powered financial solutions across the lending ecosystem.',
      keywords: 'GTM strategy, go-to-market, scaling fintech, growth strategy',
    },
  },
};

/**
 * Get SEO config for a specific path.
 * Falls back to defaults for any missing values.
 */
export function getSeoForPath(path) {
  const pageConfig = seoConfig.pages[path] || {};
  return {
    ...seoConfig.defaults,
    ...pageConfig,
    url: `${SITE_URL}${path === '/' ? '' : path}`,
  };
}

export { SITE_URL };
export default seoConfig;
