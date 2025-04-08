FROM node:latest

RUN mkdir /server

WORKDIR /server

COPY . /server/
# COPY .env_docker /server/.env

RUN npm install

EXPOSE 8080

CMD [ "sh", "-c", "npm start" ]