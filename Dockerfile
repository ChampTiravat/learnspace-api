FROM node:8.9.4-alpine

WORKDIR /learnspace
COPY . /learnspace
RUN yarn
