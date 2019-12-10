FROM node:10.16.0-alpine

RUN set -xe \
    && apk update && apk upgrade \
    && apk add \
      --no-cache \
      --repository http://dl-cdn.alpinelinux.org/alpine/edge/testing \
      --repository http://dl-cdn.alpinelinux.org/alpine/edge/main \
      bash make gcc g++ python curl postgresql-client gdal \
    && bash --version && npm -v && node -v && psql --version && ogr2ogr --version \
    && npm install -g npm \
    && rm -rf /var/cache/apk/*

WORKDIR /home/node/app

RUN mkdir -p ./node_modules && chown -R node:node ./

USER node

COPY ./package*.json ./

COPY ./bin ./bin

COPY ./client ./client

COPY ./index.js .

RUN npm install --production

COPY ./server ./server

COPY ./dbscripts ./dbscripts

COPY --chown=node:node . .

EXPOSE 3000

ENTRYPOINT [ "node", "index.js" ]