# Используем официальный Node.js образ
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Сначала копируем ВСЕ файлы из api директории
COPY . .

# Проверяем наличие структуры директорий (опционально, для отладки)
RUN ls -la && \
    if [ -d "config" ]; then echo "config directory exists"; ls -la config/; else echo "config directory NOT found"; fi

# Открываем порт
EXPOSE 5000

# Запускаем приложение
CMD ["node", "index.js"]