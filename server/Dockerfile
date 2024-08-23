FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm i tsc pm2

COPY . .

EXPOSE 3000

CMD [ "npm", "startServer" ]