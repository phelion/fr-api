FROM node:22-alpine
WORKDIR /usr/app
COPY package.json .
RUN apk add --update --no-cache bash
RUN npm i
COPY . .
