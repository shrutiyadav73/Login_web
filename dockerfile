FROM node:20-alpine

WORKDIR /ims_frontend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3106

CMD ["npm", "start"]
