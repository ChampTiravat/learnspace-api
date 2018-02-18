FROM node:8.9.4

WORKDIR /learnspace
COPY . /learnspace
RUN yarn
CMD ["npm", "run", "dev-server"]
