export function JsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_MARKETING_URL ?? 'https://aischoolmanagement.tech';

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AI School Management',
    url: siteUrl,
    logo: `${siteUrl}/icon-512.png`,
    description:
      'Global AI-powered school ERP for attendance, fees, bus tracking, homework, and parent communication.',
    email: 'hello@aischool.app',
    sameAs: [],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'hello@aischool.app',
        availableLanguage: ['English', 'Hindi'],
      },
    ],
  };

  const software = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AI School Management',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS (coming soon), Android (coming soon)',
    url: siteUrl,
    image: `${siteUrl}/og-image.png`,
    description:
      'School management software with attendance, fees, bus GPS, AI assistant, and multi-currency billing.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      description: '7-day free trial',
      url: `${siteUrl}/signup/`,
    },
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AI School Management',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/features/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is AI School Management?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AI School Management is an all-in-one school ERP for attendance, fees, bus tracking, homework, notices, analytics, and an AI assistant for admins, teachers, parents, and students.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is there a free trial?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Schools can start a 7-day free trial online with transparent pricing — no sales call required.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which currencies are supported?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Billing supports INR, USD, EUR, GBP, and AED for schools worldwide.',
        },
      },
    ],
  };

  const payloads = [organization, software, website, faq];

  return (
    <>
      {payloads.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
