import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export default function SEO({ 
  title, 
  description, 
  keywords = "Lurambi Fish Grill, Kakamega Seafood, Lake Victoria Tilapia, Grilled Fish Kakamega, Best Restaurant Kakamega, Fish Sizes 200g-500g",
  image = "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80",
  url = "https://lurambifishgrill.com/"
}: SEOProps) {
  const fullTitle = `${title} | Lurambi Fish Grill`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
}
