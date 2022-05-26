FROM node:alpine3.15

ENV NODE_VERSION 16.15.0

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]