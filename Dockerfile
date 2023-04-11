FROM node:latest

WORKDIR /devplusclient

COPY package*.json ./

RUN npm install

COPY . .

COPY .env .

EXPOSE 80

CMD ["npm", "run", "dev"]