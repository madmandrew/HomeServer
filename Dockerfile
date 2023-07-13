# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:16-alpine
# Set the working directory to /app inside the container
WORKDIR /apps
# Copy app files
COPY ./ui ./ui
COPY ./server ./server
COPY ./package.json .
COPY ./yarn.lock .
COPY ./.yarn ./.yarn
COPY ./.yarnrc.yml .

# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN yarn install --frozen-lockfile

RUN apk update
RUN apk add
RUN apk add ffmpeg

WORKDIR /apps/ui
RUN yarn install --frozen-lockfile


WORKDIR /apps/server
#RUN yarn install --frozen-lockfile
RUN yarn build

WORKDIR /apps

## Build the app
##RUN yarn build
## ==== RUN =======
## Set the env to "production"
##ENV NODE_ENV production
## Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 3000 8000
## Start the app
CMD [ "yarn", "start"]