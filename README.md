# Portfolio Backend

Dedicated Express.js REST API server for the portfolio.
Persists all data permanently to `data/database.json` and uploaded files to `uploads/`.

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
