FROM node:16.13.2-alpine

RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/
COPY . /usr/src/app/
RUN npm install

CMD [ "node", "/usr/src/app/index.js" ]