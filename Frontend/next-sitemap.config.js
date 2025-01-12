/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://cozytiny.com', // Your website's URL
  generateRobotsTxt: true, // Generate a robots.txt file
  exclude: [
    '/Backend/*',
    '/migrations/*',
    '/models/*',
    '/node_modules/*',
    '/seeders/*',
    '/CMSPage/*',
    '/CategoriesPage/*',
    '/FooterPages/*',
  ],
  sitemapSize: 50000, // Ensure all pages are included in a single sitemap file
  generateIndexSitemap: false, // Prevent generating sitemap-0.xml or an index sitemap
  additionalPaths: async (config) => {
    const fetch = (await import('node-fetch')).default; // Dynamic import of node-fetch
    const apiUrl = 'https://cozytiny.com/api/posts';

    try {
      const response = await fetch(apiUrl);
      const posts = await response.json();

      // Map posts to sitemap URLs
      return posts.map((post) => ({
        loc: `/post/${post.slug}`, // Path for the post
        lastmod: new Date(post.updatedAt).toISOString(), // Use updatedAt for last modification date
      }));
    } catch (error) {
      console.error('Error fetching posts from API:', error);
      return [];
    }
  },
};