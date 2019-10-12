FROM node:12.8.0-alpine

WORKDIR /server
COPY . .

RUN npm rebuild
RUN npm install
RUN rm -f database.sqlite

CMD [ "npm",  "run", "start", "${HOST}", "${PORT}", "${REPO}" ]

