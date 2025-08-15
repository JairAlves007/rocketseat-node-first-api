FROM node:22-alpine AS builder

WORKDIR /app

COPY . ./

RUN npm ci

EXPOSE 3000

CMD ["tsx", "src/server.ts"]