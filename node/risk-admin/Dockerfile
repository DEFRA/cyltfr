FROM osgeo/gdal:alpine-small-latest

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

RUN npm install --production

RUN npm run build

COPY ./server ./server

COPY ./dbscripts ./dbscripts

# COPY --chown=node:node . .

EXPOSE 3000

ENTRYPOINT [ "node", "index.js" ]