const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
  });
}

// Route Mounts
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/postings', require('./routes/postingRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/collaborations', require('./routes/collaborationRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Enterprise Expansion Modules
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/mentorship', require('./routes/mentorshipRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/integrations', require('./routes/integrationRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'SkillBridge Academia-Industry Collaboration Portal',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    modules: ['Auth', 'SkillEngine', 'ATS', 'Collaborations', 'DocumentVault', 'Mentorship', 'LiveProjects', 'Integrations', 'PolicyAnalytics'],
    timestamp: new Date().toISOString(),
  });
});

// Database seed endpoint (accessible on cloud to re-populate demo dataset)
app.get('/api/seed', async (req, res) => {
  try {
    const { seedDB } = require('./scripts/seed');
    const result = await seedDB(false);
    res.json({ success: true, message: 'Database successfully seeded with demo accounts & data!', result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve frontend production build if available
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  // Client-side SPA routing fallback (all non-API routes)
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  // Standalone API root route fallback
  app.get('/', (req, res) => {
    res.json({ message: 'Academia-Industry Collaboration API is running with Enterprise Extensions.' });
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 [Server] Backend running in ${process.env.NODE_ENV || 'development'} mode on http://0.0.0.0:${PORT}`);
});
