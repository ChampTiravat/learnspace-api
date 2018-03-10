FROM node:8.10.0
WORKDIR /learnspace
COPY . /learnspace
RUN yarn
CMD ["yarn", "dev-server"]
