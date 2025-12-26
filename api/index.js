import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import { initTables } from './src/config/init.js';
import speedtestRoutes from './src/routes/speedtestRoutes.js';

// Инициализация базы данных
initTables();

const app = express();
dotenv.config();

// Middleware
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CORS настройка
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://proddomen.com',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS блокирован для origin: ${origin}`;
      console.error(msg);
      return callback(new Error(msg), false);
    }
    
    return callback(null, true);
  },
  methods: ["GET", "POST"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/speedtest', speedtestRoutes);


// Обработка 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

export default app;