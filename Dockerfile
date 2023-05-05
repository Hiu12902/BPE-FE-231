# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:16.17.1-alpine3.16 as build

WORKDIR /usr/app

COPY . /usr/app

RUN mkdir -p /opt/node_modules

RUN yarn install

COPY . .

RUN yarn build

FROM nginx:1.23.1-alpine
EXPOSE 80
COPY ./docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/app/dist /usr/share/nginx/html