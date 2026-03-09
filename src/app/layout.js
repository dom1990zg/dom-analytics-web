import './globals.css';

export const metadata = {
  title: 'Dom Analytics | AI Consulting & Software Development',
  description: 'AI-powered consulting, data analytics, and custom software development. We build intelligent solutions that transform your business.',
  keywords: 'AI consulting, machine learning, data analytics, web development, app development, IT consulting, business intelligence',
  openGraph: {
    title: 'Dom Analytics | Innovate. Analyze. Succeed.',
    description: 'AI-powered consulting, analytics & custom software development',
    url: 'https://domanalytics.com',
    siteName: 'Dom Analytics',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo-small.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
