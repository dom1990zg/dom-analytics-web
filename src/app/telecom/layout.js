export const metadata = {
  title: 'Telecom Revenue & Monetization',
  description: 'Independent commercial advisory on A2P SMS monetization for mobile operators and messaging providers: operator exclusivity, A2P pricing, firewall economics, RFP support.',
  alternates: { canonical: 'https://domanalytics.com/telecom' },
  openGraph: {
    type: 'website',
    url: 'https://domanalytics.com/telecom',
    title: 'Telecom Revenue & Monetization | Dom Analytics',
    description: 'Independent commercial advisory on A2P SMS monetization for mobile operators and messaging providers: operator exclusivity, A2P pricing, firewall economics, RFP support.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Telecom Revenue & Monetization | Dom Analytics',
    description: 'Independent commercial advisory on A2P SMS monetization for mobile operators and messaging providers.',
  },
};

export default function TelecomLayout({ children }) {
  return <>{children}</>;
}
