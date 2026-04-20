// backend/server.js

const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user');
const appointmentRoutes = require('./routes/appointment');
require('dotenv').config();

const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Allowed Origins
const allowedOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'https://saieswarreddyg-doctorappointment.netlify.app',
];

// ✅ CORS Configuration (FINAL)
app.use(cors({
  origin: function (origin, callback) {

    // Allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    // Allow exact matches
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow all Netlify deployments (preview + production)
    if (origin.endsWith('.netlify.app')) {
      return callback(null, true);
    }

    console.log("❌ Blocked by CORS:", origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use('/api/user', userRoutes);
app.use('/api/appointments', appointmentRoutes);

// ✅ Health check
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// ❌ 404 handler
app.use((req, res) => {
  res.status(404).send('❌ Route not found');
});

// ❌ Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).send('❌ Internal Server Error');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});