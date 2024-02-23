FROM node:18-alpine AS node
FROM ghcr.io/osgeo/gdal:alpine-small-latest
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
    && rm -rf /var/cache/apk/*

WORKDIR /home/node/app

RUN mkdir -p ./node_modules

# USER node

COPY ./package*.json ./

COPY ./bin ./bin

COPY ./client ./client

COPY ./index.js .

RUN npm install --omit=dev

RUN npm run build

COPY ./server ./server

COPY ./dbscripts ./dbscripts

# COPY --chown=node:node . .

EXPOSE 3000

CMD [ "node", "index.js" ]
