# Central Admin Portal

This folder is a standalone Vercel project containing owner login, the dashboard, and `/api/data`.

## Environment

Add this environment variable in Vercel:

```text
MONGODB_URI=your MongoDB Atlas connection string
```

## Configure owners and public websites

Edit `admin-config.js`:

- Add every permitted owner email to `authorizedAdminEmails`.
- Add each academy slug and deployed public URL to `publicSites`.
- Set `defaultPublicSiteUrl` to the main public academy site.

Example:

```js
window.ADMIN_PORTAL_CONFIG = Object.freeze({
  defaultPublicSiteUrl: 'https://diganta.vercel.app',
  authorizedAdminEmails: Object.freeze([
    'owner@example.com'
  ]),
  publicSites: Object.freeze({
    diganta: 'https://diganta.vercel.app'
  })
});
```

The slug in this mapping must match the slug configured in that public site's `site-config.js`.

## Deploy

Import the repository into Vercel and select `admin-portal` as the Root Directory. Keep this as one central deployment; new academies only require another deployment of `public-site`.

Also add the final Admin Portal domain to the authorized JavaScript origins/redirect configuration of the Google OAuth client used in `index.html`.
