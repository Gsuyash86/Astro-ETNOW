const WebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: import.meta.env.WEBAPP_BASE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${import.meta.env.WEBAPP_BASE_URL}/search-result/{search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
});

export default WebSiteSchema;
