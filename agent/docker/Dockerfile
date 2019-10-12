FROM node:12.8.0-alpine
WORKDIR /agent
RUN apk update && apk add git docker

COPY . .
RUN npm install

CMD ["npm",  "run", "start", "${AGENT_HOST}", "${AGENT_PORT}", "${SERVER_HOST}", "${SERVER_PORT}"]