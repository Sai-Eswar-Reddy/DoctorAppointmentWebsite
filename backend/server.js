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

// ✅ Allowed Origins (Frontend + Local + Render)
const allowedOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'https://saieswarreddyg-doctorappointment.netlify.app',
  
];

// ✅ CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ API Routes
app.use('/api/user', userRoutes);
app.use('/api/appointments', appointmentRoutes);

// ✅ Health Check Route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// ❌ Handle 404 Errors
app.use((req, res, next) => {
  res.status(404).send('❌ Route not found');
});

// ❌ Global Error Handler (VERY IMPORTANT)
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).send('❌ Internal Server Error');
});

// ✅ Start Server (Render-compatible)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});