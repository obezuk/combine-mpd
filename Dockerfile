FROM node:8

RUN mkdir -p /srv

WORKDIR /srv

COPY ./ /srv

RUN npm install

ENTRYPOINT ["node", "index.js"]