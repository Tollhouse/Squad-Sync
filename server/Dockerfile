FROM node:latest


WORKDIR /server

COPY . .
# COPY .env_docker /server/.env

RUN npm install

EXPOSE 8080

CMD [ "sh", "-c", "npm start" ]