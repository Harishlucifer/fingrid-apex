import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import seoConfig, { SITE_URL } from '../config/seo';

/**
 * SEO Component
 *
 * A reusable, production-ready SEO component that manages all document head meta tags.
 *
 * @param {Object} props
 * @param {string}  [props.title]       - Page title (appended with site name)
 * @param {string}  [props.description] - Meta description for the page
 * @param {string}  [props.url]         - Canonical URL (auto-detected from route if omitted)
 * @param {string}  [props.image]       - Open Graph / Twitter image URL
 * @param {string}  [props.keywords]    - Comma-separated keywords meta tag
 * @param {boolean} [props.noindex]     - If true, adds noindex,nofollow robots directive
 * @param {string}  [props.type]        - Open Graph type (default: 'website')
 * @param {string}  [props.locale]      - Open Graph locale (default: 'en_US')
 * @param {React.ReactNode} [props.children] - Additional head elements (e.g., structured data)
 *
 * @example
 * <SEO
 *   title="Products"
 *   description="Explore our product suite"
 *   keywords="fintech, lending, AI"
 * />
 *
 * @example
 * // Private page with noindex
 * <SEO title="Admin Dashboard" noindex />
 */
export default function SEO({
  title,
  description,
  url,
  image,
  keywords,
  noindex = false,
  type,
  locale,
  children,
}) {
  const { pathname } = useLocation();
  const defaults = seoConfig.defaults;

  // Resolve final values with smart fallbacks
  const seoTitle = title || defaults.title;
  const seoDescription = description || defaults.description;
  const seoImage = image || defaults.image;
  const seoUrl = url || `${SITE_URL}${pathname === '/' ? '' : pathname}`;
  const seoKeywords = keywords || defaults.keywords;
  const seoType = type || defaults.type;
  const seoLocale = locale || defaults.locale;
  const seoSiteName = defaults.siteName;
  const seoTwitterHandle = defaults.twitterHandle;

  return (
    <Helmet>
      {/* ── Primary Meta Tags ── */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content={seoSiteName} />

      {/* ── Canonical URL ── */}
      <link rel="canonical" href={seoUrl} />

      {/* ── Robots ── */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* ── Open Graph / Facebook ── */}
      <meta property="og:type" content={seoType} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content={seoSiteName} />
      <meta property="og:locale" content={seoLocale} />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      {seoTwitterHandle && (
        <meta name="twitter:site" content={seoTwitterHandle} />
      )}
      {seoTwitterHandle && (
        <meta name="twitter:creator" content={seoTwitterHandle} />
      )}

      {/* ── Additional children (structured data, etc.) ── */}
      {children}
    </Helmet>
  );
}
