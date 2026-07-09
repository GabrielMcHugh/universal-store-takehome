FROM node:20-alpine

ENV NODE_ENV development

WORKDIR /app

COPY package*.json ./
RUN npm install

EXPOSE 5000

CMD ["npm", "run", "dev"]
