FROM node:20-alpine AS node
FROM ghcr.io/osgeo/gdal:alpine-small-3.8.4
COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/share /usr/local/share
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin

RUN set -xe \
    && apk update && apk upgrade \
    && apk add bash make gcc g++ py-pip curl postgresql-client npm \
    && bash --version && npm -v && node -v && psql --version && ogr2ogr --version \
    && npm install -g npm \
    && rm -rf /var/cache/apk/* \
    && addgroup -S node \
    && adduser -S -D -G node node \
    && mkdir /home/node/app \
    && chown -R node:node /home/node/

WORKDIR /home/node/app

RUN mkdir -p ./node_modules

COPY --chown=root:root ./package*.json ./

COPY --chown=root:root ./index.js .

COPY --chown=root:root ./config ./config

RUN npm ci

COPY --chown=root:root ./server ./server

EXPOSE 8050

USER node

CMD [ "node", "index.js" ]
