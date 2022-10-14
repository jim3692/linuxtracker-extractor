FROM node:16-bullseye-slim
ENV NODE_ENV=production
WORKDIR /app

COPY package* .
RUN npm ci

COPY . .
ENTRYPOINT [ "node", "." ]
