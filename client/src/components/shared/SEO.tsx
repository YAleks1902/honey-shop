import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const SITE_NAME = 'Мёд из Кадымки';
const DEFAULT_DESC = 'Натуральный мёд из села Кадымка. Доставка по всей России.';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&q=80';

export default function SEO({ title, description = DEFAULT_DESC, image = DEFAULT_IMAGE, url }: SEOProps) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — натуральный мёд из России`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      {url && <meta property="og:url" content={url} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
