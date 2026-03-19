const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true })); // Allow all for now, or specify frontend origin
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Controllers
const authController = require('./controllers/auth');
const subjectsController = require('./controllers/subjects');
const progressController = require('./controllers/progress');
const aiController = require('./controllers/ai');

// Auth Middleware
const { authenticateToken } = require('./middleware/auth');

// Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// AI Chat Route
app.post('/api/ai/chat', authenticateToken, aiController.chat);

// Auth Routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/refresh', authController.refresh);
app.post('/api/auth/logout', authController.logout);

// Subject & Video Routes
app.get('/api/subjects', subjectsController.getAllSubjects);
app.get('/api/subjects/:slug', subjectsController.getSubjectBySlug);
app.get('/api/subjects/:slug/tree', authenticateToken, subjectsController.getSubjectTree);
app.get('/api/videos/:id', authenticateToken, subjectsController.getVideoById);

// Progress Routes
app.get('/api/progress/videos/:videoId', authenticateToken, progressController.getProgress);
app.post('/api/progress/videos', authenticateToken, progressController.upsertProgress);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 LMS Backend running at http://localhost:${PORT}`);
});
