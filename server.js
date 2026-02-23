const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const CANONICAL_DOMAIN = 'https://aurelianjets.com';

// 301 redirect Railway URL to custom domain so Google and users see aurelianjets.com
app.use((req, res, next) => {
  const host = (req.headers.host || '').toLowerCase();
  if (host.includes('railway.app')) {
    const target = CANONICAL_DOMAIN + req.originalUrl;
    return res.redirect(301, target);
  }
  next();
});

app.use(express.static(path.join(__dirname), { index: 'index.html' }));

app.listen(PORT, () => {
  console.log(`Aurelian Jets listening on port ${PORT}`);
});
