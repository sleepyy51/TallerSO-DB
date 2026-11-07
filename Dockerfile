FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY api.js ./

EXPOSE 8080

CMD ["npm", "start"]
