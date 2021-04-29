#!/bin/sh

node ./node_modules/.bin/prisma migrate deploy && node ./index.js
