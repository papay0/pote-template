import { TranslationStructure } from '@/lib/i18n';

export function getOrganizationSchema(t: TranslationStructure) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: t.brand.name,
    description: t.brand.description,
    url: 'https://example.com', // Update with actual URL
    logo: 'https://example.com/logo.png', // Update with actual logo
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: t.footer.phone,
      contactType: 'customer service',
      availableLanguage: ['English', 'French'],
    },
    sameAs: [
      // Add social media URLs here
    ],
  };
}

export function getLocalBusinessSchema(t: TranslationStructure) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: t.brand.name,
    description: t.brand.description,
    image: 'https://example.com/business-image.jpg', // Update with actual image
    '@id': 'https://example.com',
    url: 'https://example.com',
    telephone: t.footer.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Business Street, Suite 100',
      addressLocality: 'City',
      addressRegion: 'ST',
      postalCode: '12345',
      addressCountry: 'US',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '10:00',
        closes: '16:00',
      },
    ],
    priceRange: '$$',
  };
}

export function getWebSiteSchema(t: TranslationStructure, locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: t.brand.name,
    description: t.brand.description,
    url: 'https://example.com',
    inLanguage: locale === 'fr' ? 'fr-FR' : 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://example.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getFAQSchema(questions: readonly { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function getServiceSchema(service: {
  name: string;
  description: string;
  provider: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: service.provider,
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Business Services',
    },
  };
}