# Etapa 1: Build del frontend con Vite
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

# Definimos las variables VITE_ como argumentos de build
ARG VITE_USER_API_URL
ARG VITE_POST_API_URL

# Las exponemos como variables de entorno para que Vite las use
ENV VITE_USER_API_URL=$VITE_USER_API_URL
ENV VITE_POST_API_URL=$VITE_POST_API_URL

# Ejecutamos el build
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
