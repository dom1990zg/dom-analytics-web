import './globals.css';

export const metadata = {
  metadataBase: new URL('https://domanalytics.com'),
  title: {
    default: 'Dom Analytics | AI Consulting & Software Development',
    template: '%s | Dom Analytics',
  },
  description: 'AI-powered consulting, data analytics, and custom software development. We build intelligent solutions that transform your business. Based in Croatia, serving clients globally.',
  keywords: ['AI consulting', 'machine learning', 'data analytics', 'web development', 'app development', 'IT consulting', 'business intelligence', 'digital transformation', 'Croatia', 'telecom optimization', 'predictive analytics', 'NLP', 'LLM integration'],
  authors: [{ name: 'Dom Analytics', url: 'https://domanalytics.com' }],
  creator: 'Dom Analytics',
  publisher: 'Dom Analytics',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'hr_HR',
    url: 'https://domanalytics.com',
    siteName: 'Dom Analytics',
    title: 'Dom Analytics | AI Consulting & Software Development',
    description: 'We build intelligent solutions that transform your business. AI-powered consulting, analytics & custom software development.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Dom Analytics - Innovate. Analyze. Succeed.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dom Analytics | AI Consulting & Software Development',
    description: 'We build intelligent solutions that transform your business.',
    images: ['/og-image.png'],
  },
  verification: {},
  alternates: {
    canonical: 'https://domanalytics.com',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Dom Analytics',
    url: 'https://domanalytics.com',
    logo: 'https://domanalytics.com/logo.png',
    description: 'AI-powered consulting, data analytics, and custom software development.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Poreč',
      addressCountry: 'HR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+385994385030',
      contactType: 'sales',
      email: 'dom.krusic@gmail.com',
    },
    sameAs: ['https://linkedin.com/in/domagojkrusic'],
    foundingDate: '2023',
    founder: { '@type': 'Person', name: 'Domagoj Krušić' },
    knowsAbout: ['Artificial Intelligence', 'Machine Learning', 'Data Analytics', 'Business Intelligence', 'Web Development', 'IT Consulting'],
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo-small.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#0a0a0f" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}