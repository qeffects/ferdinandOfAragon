FROM node:alpine as builder

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

## Install build toolchain, install node deps and compile native add-ons
RUN apk add --no-cache python make g++ && npm config set update-notifier false

# RUN npm install
# If you are building your code for production
RUN npm ci --only=production

FROM node:alpine as app

# Create app directory
WORKDIR /usr/src/app

## Copy built node modules and binaries without including the toolchain
COPY --from=builder node_modules node_modules
COPY index.js .

USER node

CMD ["node","index.js"]
