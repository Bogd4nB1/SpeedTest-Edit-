import express from 'express';
import speedtestController from '../controllers/speedtestController.js';

const router = express.Router();

// Получить все результаты тестов
router.get('/results', speedtestController.getResults);

// Сохранить результат теста скорости
router.post('/save', speedtestController.saveResult);

// Получить статистику по результатам
router.get('/stats', speedtestController.getStats);

export default router;