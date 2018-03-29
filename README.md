# learnspace-api

[![Build Status](https://travis-ci.org/ChampTiravat/learnspace-api.svg?branch=setup-ci)](https://travis-ci.org/ChampTiravat/learnspace-api)

Learnspace is a learning management system(LMS) originally built to enhance the interactivity of the learning process outside the regular classroom with a tools for both instructors and students to use, in order to to improve and gain the best learning and teaching experience. it also built to support a group of people with the same interest to virtually group up and share their knowledge by utilizing a tools inside the app

### KEY FEATURES

* Online Classroom
* Realtime Chat
* Online Quiz/Examination
* Learning Progress Analyzer(Designed for students)
* Students Analyzer(Designed for instructors)

### TECHNOLOGIES INVOLVED

* Backend
  * Nodejs
  * GraphQL
  * Apollo Server
  * MongoDB
  * Redis
  * JWT Authentication
* Frontend
  * Reactjs
  - Redux
  * Nextjs
  * Styled-Components
  * Apollo Client
  * PWA Enhancement

- Deployment
  * Docker
  - Yarn

### TODO

* Fix Authentication Mechanism in security-helpers.js
* Consider changing the API of authentication helper functions and the ways to use them
* Try to correctly setup Continous-Intration
* Try to setup Unit Testing for Back-end API
* Try to setup Unit Testing for Front-end
* Saving JWT token in Redis
* Cache Mongoose Object using Redis
* Restructure Redux using Duck pattern
* Default user/classroom profile
* Applying DataLoader
* Notification system with GraphQL Subscription
* Realtime Messaging with GraphQL Subscription

### LONG TERM

* Load-Balancing with Nginx
* Reverse-Proxy with Nginx
* Process Management with PM2
* Responsive UI Support
* PWA Support

### IDEA

* MongoDB replica sets
