<h1 align="center">Banka</h1>

## A lightweight core banking application

[![Build Status](https://travis-ci.org/PreciousTosin/Banka.svg?branch=master)](https://travis-ci.org/PreciousTosin/Banka)
[![Coverage Status](https://coveralls.io/repos/github/PreciousTosin/Banka/badge.svg?branch=master)](https://coveralls.io/github/PreciousTosin/Banka?branch=master)

## Quickstart 
```
  clone the repo
  cd into repo directory
  setup a .env file in the project root directory with the following fields:
    NODE_ENV
    PORT
    API_VERSION
    SECRET_KEY
  npm install
  npm start
```

### Available commands
1. `npm start` - starts express server
2. `npm run lint` - runs eslint to check for lint errors
3. `npm test` - runs unit tests

### Heroku API
##### Link - https://bankar.herokuapp.com/v1
##### Documentation - https://documenter.getpostman.com/view/938650/S1ENxJKx

### Test User Accounts
#### Admin
email - `tylerross@gmail.com`
password - `tylerross`

#### Staff
email - `johnwayne@gmail.com`
password - `johnwayne`

#### Client
email - `jamesdonovan@gmail.com`
password - `jamesdonovan`

### Test Bank Accounts
Account Number - `2869502843` status - `draft`

Account Number - `2816408925` status - `active`