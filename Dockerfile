FROM node:lts-alpine as builder

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . ./

## Install build toolchain, install node deps and compile native add-ons
RUN apk add --update --no-cache alpine-sdk python3

# RUN npm install
# If you are building your code for production
RUN npm ci
RUN npm run build-ts


FROM node:lts-alpine as app

# Create app directory
WORKDIR /usr/src/app

## Copy built node modules and binaries without including the toolchain
COPY --from=builder node_modules node_modules
COPY --from=builder dist/. .

COPY prisma prisma

COPY ./scripts/start.sh .
RUN chmod +x ./start.sh

USER node

CMD ["./start.sh"]
