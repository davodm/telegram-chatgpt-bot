FROM node:18-alpine
WORKDIR /telegram-chatgpt-bot

COPY package*.json ./
RUN npm install --production
RUN npm audit fix
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]