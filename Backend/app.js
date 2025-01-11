const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./db/db');
const postRoutes = require('./routes/postRoutes');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/postimage', express.static(path.join(__dirname, 'postimage')));

app.use('/api/steps', postRoutes);

// Register routes
app.use('/api/posts', postRoutes);

// Debugging Routes (Optional)
app._router.stack.forEach((layer) => {
  if (layer.route) {
    console.log(`Route: ${layer.route.path}`);
  }
});

// Database Sync and Server Start
sequelize.sync().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});