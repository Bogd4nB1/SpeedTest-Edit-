# Используем Node.js для serve (проще чем Nginx для разработки)
FROM node:18-alpine

# Устанавливаем serve для статических файлов
RUN npm install -g serve

# Рабочая директория
WORKDIR /usr/src/app

# Копируем файлы
COPY ../index.html ../hosted.html ./
COPY ../assets/ ./assets/
COPY ../downloading/ ./downloading/
COPY ../upload/ ./upload/

# Порт
EXPOSE 3000

# Запускаем сервер
CMD ["serve", "-s", ".", "-l", "3000"]