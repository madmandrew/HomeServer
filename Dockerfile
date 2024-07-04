# ==== CONFIGURE =====
# Use a Node 16 base image to build apps
FROM node:16-alpine AS build
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

WORKDIR /apps/ui
RUN yarn install --frozen-lockfile
RUN yarn build

WORKDIR /apps/server
#RUN yarn install --frozen-lockfile
RUN yarn build

WORKDIR /apps

# Use a nginx to server apps
FROM node:16-alpine

COPY --from=build /apps/server/dist /apps/server
#COPY --from=build /apps/server/node_modules /apps/server/node_modules
COPY --from=build /apps/ui/build /apps/server/ui

RUN apk update
RUN apk add
RUN apk add ffmpeg

WORKDIR /apps/server
RUN yarn install --production

EXPOSE 8000

CMD ["node", "/apps/server/server/index.js"]
