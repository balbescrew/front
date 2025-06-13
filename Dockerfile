# Используем официальный образ Node.js для сборки
FROM node:18-alpine as builder

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json (или yarn.lock)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта
COPY . .

# Собираем приложение
RUN npm run build

# Используем легковесный nginx для раздачи статики
FROM nginx:alpine

# Копируем собранные файлы из стадии builder в nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфиг nginx (если нужен)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]