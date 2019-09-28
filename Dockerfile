# build environment

FROM node:10-alpine
#as build

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# add `/app/node_modules/.bin` to $PATH
#ENV PATH /app/node_modules/.bin:$PATH

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install --silent

#RUN npm install react-scripts@3.0.1 -g --silent

COPY --chown=node:node . .

CMD ["npm", "start"]

#RUN npm run build

# production environment
#FROM nginx:1.16.0-alpine
#COPY --from=build /home/node/app/build /usr/share/nginx/html
#RUN rm /etc/nginx/conf.d/default.conf
#COPY nginx/nginx.conf /etc/nginx/conf.d
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]