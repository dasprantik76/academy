/**
 * Central Admin Portal configuration.
 * Add each independently deployed public academy URL to publicSites.
 */
window.ADMIN_PORTAL_CONFIG = Object.freeze({
  defaultPublicSiteUrl: 'https://YOUR-PUBLIC-SITE.vercel.app',
  authorizedAdminEmails: Object.freeze([
    'poulami.13thmay@gmail.com',
    'dasprantik76@gmail.com'
  ]),
  publicSites: Object.freeze({
    prantik: 'https://YOUR-PUBLIC-SITE.vercel.app'
  })
});
