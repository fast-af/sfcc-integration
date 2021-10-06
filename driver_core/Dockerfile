# Install from the node life time support package.
FROM node:lts-alpine3.14 as base
# set up a path variable
ENV APP_PATH=/usr/fast/app

# Create app directory.
WORKDIR ${APP_PATH}

# Install app dependencies.
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+).
COPY package*.json ./

# ======= Local ========
FROM base as local

# change directory.
RUN cd ${APP_PATH}
# If you are building your code for local.
RUN npm i

# bundle app source.
COPY . .

# ignore the self signed certificate in certificate chain issue.
RUN npm config set strict-ssl false

# ======= Production Magento ========
FROM base as production-magento

# change directory.
RUN cd ${APP_PATH}
# If you are building your code for production.
RUN npm ci --only=production

# bundle app source.
COPY . .

# ignore the self signed certificate in certificate chain issue.
RUN npm config set strict-ssl false

# remove the local .env file.
RUN rm .env
# rename .env.prod.magento to .env.
RUN mv .env.prod.magento .env

# set the path in the environment variable.
ENV NODE_PATH=./dist
# run build.
RUN npm run build

# ======= Production SFCC ========
FROM base as production-sfcc

# change directory.
RUN cd ${APP_PATH}
# If you are building your code for production.
RUN npm ci --only=production

# bundle app source.
COPY . .

# ignore the self signed certificate in certificate chain issue.
RUN npm config set strict-ssl false

# remove the local .env file.
RUN rm .env
# rename .env.prod.sfcc to .env.
RUN mv .env.prod.sfcc .env

# set the path in the environment variable.
ENV NODE_PATH=./dist
# run build.
RUN npm run build