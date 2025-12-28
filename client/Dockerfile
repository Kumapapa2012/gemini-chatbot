# ビルドステージ
FROM node:24.12.0 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 本番ステージ
FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# nginxがファイルとディレクトリを読み取れるようにパーミッションを設定
RUN chmod -R a+r /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
