# Используем легкий образ Nginx
FROM nginx:alpine

# Удаляем стандартную страницу Nginx
RUN rm -rf /usr/share/nginx/html/*

# Копируем все файлы вашего сайта в контейнер
COPY . /usr/share/nginx/html/

# Открываем порт 80 (HTTP)
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]