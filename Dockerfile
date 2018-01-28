FROM node:8.9.1-alpine

WORKDIR /learnspace
COPY ./* /learnspace/
RUN yarn

EXPOSE 5000

CMD ["yarn", "dev-server"]

