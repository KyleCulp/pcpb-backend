FROM node:12

# The node image comes with a base non-root 'node' user which this Dockerfile
# gives sudo access. However, for Linux, this user's GID/UID must match your local
# user UID/GID to avoid permission issues with bind mounts. Update USER_UID / USER_GID
# if yours is not 1000. See https://aka.ms/vscode-remote/containers/non-root-user.
ARG USER_UID=${UID:-1000}
ARG SETUP_MODE=normal

COPY scripts/setup.sh /setup.sh
RUN /setup.sh $SETUP_MODE



# # #Taken from Bret Fisher's Dockercon Example
# # #https://github.com/BretFisher/dockercon19

# FROM node:12 as base
# ENV NODE=ENV=production
# ENV TINI_VERSION v0.18.0
# ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
# RUN chmod +x /tini
# EXPOSE 3000
# RUN mkdir /app && chown -R node:node /app
# WORKDIR /app
# ADD . /app
# USER node
# COPY --chown=node:node package.json package-lock*.json ./
# RUN npm ci && npm cache clean --force

# FROM base as dev
# ENV NODE_ENV=development
# ENV PATH=/app/node_modules/.bin:$PATH
# RUN npm install --only=development
# USER root
# CMD ["npm", "run", "start:dev"]

# FROM base as source
# COPY --chown=node:node . .

# FROM source as test
# ENV NODE_ENV=development
# ENV PATH=/app/node_modules/.bin:$PATH
# COPY --from=dev /app/node_modules /app/node_modules
# RUN eslint .
# RUN npm test
# CMD ["npm", "run", "test"]

# FROM test as audit
# USER root
# RUN npm audit --audit-level critical
# ARG MICROSCANNER_TOKEN
# ADD https://get.aquasec.com/microscanner /
# RUN chmod +x /microscanner
# RUN /microscanner $MICROSCANNER_TOKEN --continue-on-failure

# FROM source as prod
# ENTRYPOINT ["/tini", "--"]
# RUN npm run build
# CMD ["node", "./dist/index.js"]