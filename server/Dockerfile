FROM node:10-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

# Arguments
ARG DB_HOST
ENV DB_HOST=${DB_HOST}

USER root
COPY package.json ./
RUN npm install

#check file .dockerignore
COPY --chown=node:node . .

EXPOSE 4000

CMD [ "node", "server.js" ]