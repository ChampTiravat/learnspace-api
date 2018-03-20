FROM node:8.10.0
WORKDIR /learnspace-api
COPY . /learnspace-api
RUN yarn
EXPOSE 5000
CMD ["yarn", "dev-server"]
