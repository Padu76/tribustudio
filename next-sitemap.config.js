/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.tribustudio.it',
  outDir: 'public',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.8,
  exclude: ['/admin/*', '/_next/*', '/api/*'],

  // URL "logiche" per la one-page
  additionalPaths: async (config) => {
    const add = (p) => config.transform(config, p);
    return Promise.all([
      add('/chi-siamo'),
      add('/servizi'),
      add('/come-funziona'),
      add('/testimonianze'),
      add('/faq'),
      add('/contatti'),
    ]);
  },

  // NIENTE additionalSitemaps -> evitiamo il riferimento circolare
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/_next/', '/admin/'] },
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'Googlebot-Image', allow: ['/images/'] },
    ],
  },

  // Filtra asset e cose non-pagina (es. /icon.png)
  transform: async (config, path) => {
    const isAsset =
      path.startsWith('/icon') ||
      path.endsWith('.png') ||
      path.endsWith('.jpg') ||
      path.endsWith('.jpeg') ||
      path.endsWith('.webp') ||
      path.endsWith('.svg') ||
      path.endsWith('.ico');

    if (isAsset) return null; // esclude dalla sitemap

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
