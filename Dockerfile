FROM node:16.13.2-alpine

RUN mkdir -p /usr/src/app/
COPY ./website/ /usr/src/app/
WORKDIR /usr/src/app
RUN npm install
EXPOSE 3000

CMD [ "node", "/usr/src/app/index.js" ]