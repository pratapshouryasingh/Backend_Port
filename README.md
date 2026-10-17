# Portfolio Backend

Dedicated Express.js REST API server for the portfolio.
Stores portfolio data in `data/database.json` by default and uploaded files in `uploads/`.
On Render, the default filesystem is temporary. To keep changes across restarts and
deploys, attach a persistent disk mounted at `/var/data` and set `DATA_DIR=/var/data`
in the backend service's environment. The first startup with that setting copies an
existing `data/database.json` into the mounted disk when available.

## Features
- **Projects**: Create, Read, Update, Delete projects
- **Experience**: Create, Read, Update, Delete work & freelance experiences
- **Skills**: Create, Read, Update, Delete skills with orbit rings & icons
- **Home Content**: Update hero badge, titles, description, buttons, and social links
- **Resume Uploads**: PDF upload handler with static file serving
- **Admin Auth**: Login validation

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# or
npm start
```

The server runs on http://localhost:5000
