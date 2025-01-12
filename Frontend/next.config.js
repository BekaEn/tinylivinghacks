module.exports = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_BASE_URL: 'https://cozytiny.com',
  },
  async rewrites() {
    return [
      { source: '/about-us', destination: '/FooterPages/AboutUs' },
      { source: '/terms-of-service', destination: '/FooterPages/TermsOfService' },
      { source: '/privacy-policy', destination: '/FooterPages/PrivacyPolicy' },
      { source: '/editorial-guidelines', destination: '/FooterPages/EditorialGuidelines' },
      { source: '/contact', destination: '/FooterPages/Contact' },
      { source: '/Category/:category', destination: '/CategoriesPage/CategoryPosts' },
      { source: '/admin', destination: '/CMSPage/AdminPanel' },
      { source: '/admin/cmspage', destination: '/CMSPage/CMSPage' },
      { source: '/admin/manageposts', destination: '/CMSPage/ManagePosts' },
    ];
  },
  webpackDevMiddleware: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.watchOptions = {
        ignored: /node_modules/,
      };
    }
    return config;
  },
};