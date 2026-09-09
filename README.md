# Academy platform deployments

This repository is split into two independent Vercel projects:

- `public-site/` — the public academy website. Make one copy/deployment per academy.
- `admin-portal/` — the single central Admin Portal, MongoDB API, and owner login.

In Vercel, import this repository twice and select the appropriate **Root Directory** for each project.

See the README inside each folder for configuration and deployment steps.

The central Admin Portal Vercel project requires these server-side environment variables
for student registration and passport-photo uploads:

```text
MONGODB_URI=your MongoDB Atlas connection string
IMAGEKIT_PRIVATE_KEY=your ImageKit private key
IMAGEKIT_PUBLIC_KEY=your ImageKit public key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/d3ycnoiwd
```

Never place `IMAGEKIT_PRIVATE_KEY` in `public-site/`, browser code, GitHub, or a public
environment variable. The serverless `/api/imagekit-auth` endpoint is the only code that
uses it to sign uploads.

The repository root also preserves the existing central Admin Portal deployment.
Its files match `admin-portal/` so the current root-based deployment continues to work.
