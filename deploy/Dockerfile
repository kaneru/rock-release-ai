FROM node:16.3.0-alpine as builder

ARG GITHUB_ACCESS_TOKEN
WORKDIR /usr/app
COPY ./package.json package-lock.json ./

RUN echo -e "//npm.pkg.github.com/:_authToken=${GITHUB_ACCESS_TOKEN}\n@indriver:registry=https://npm.pkg.github.com" > .npmrc
ENV PORT=8080
RUN npm ci

COPY . .
RUN rm -rf .npmrc
RUN npm run build

EXPOSE 8080
USER 101

CMD ["npm", "run", "start"]
