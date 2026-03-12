FROM node:22-alpine as builder
RUN npm config set fetch-retry-mintimeout 20000; npm config set fetch-retry-maxtimeout 120000
RUN apk add python3 build-base
WORKDIR /mnt
ADD package.json package.json
RUN npm i --ignore-scripts
ADD tsconfig.json tsconfig.json
ADD src src
RUN npx tsc

FROM node:22-alpine as deps
RUN npm config set fetch-retry-mintimeout 20000; npm config set fetch-retry-maxtimeout 120000
RUN apk add python3 build-base
WORKDIR /mnt
ADD package.json package.json
RUN npm i --omit dev --ignore-scripts

FROM node:22-alpine 
WORKDIR /mnt
COPY --from=deps /mnt/node_modules /mnt/node_modules
COPY --from=builder /mnt/build /mnt/build
ADD package.json /mnt/package.json
CMD npx tsx --watch src/app.ts
# CMD npm run start --ignore-scripts
