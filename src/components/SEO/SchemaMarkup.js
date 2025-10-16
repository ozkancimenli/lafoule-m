import Head from 'next/head';

const SchemaMarkup = ({
  type = 'WebSite',
  name,
  description,
  url,
  image,
  author,
  datePublished,
  dateModified,
  articleBody,
}) => {
  const getSchema = () => {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': type,
      name: name,
      description: description,
      url: url,
      image: image,
    };

    if (type === 'Person') {
      return {
        ...baseSchema,
        '@type': 'Person',
        jobTitle: 'Web Developer',
        worksFor: {
          '@type': 'Organization',
          name: 'Freelance',
        },
        sameAs: [
          'https://github.com/ozkancimenli',
          'https://linkedin.com/in/ozkancimenli',
        ],
      };
    }

    if (type === 'Article') {
      return {
        ...baseSchema,
        '@type': 'Article',
        author: {
          '@type': 'Person',
          name: author,
        },
        publisher: {
          '@type': 'Person',
          name: author,
          image: image,
        },
        datePublished: datePublished,
        dateModified: dateModified,
        articleBody: articleBody,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
      };
    }

    if (type === 'WebSite') {
      return {
        ...baseSchema,
        '@type': 'WebSite',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${url}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      };
    }

    return baseSchema;
  };

  return (
    <Head>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getSchema()),
        }}
      />
    </Head>
  );
};

export default SchemaMarkup;
