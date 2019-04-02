const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const dotenv = require('dotenv');

/* -------- ROUTES ---------------- */
const homeRoute = require('./routes/home');

/* -------- CONTROLLERS ---------------- */

dotenv.config();
const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}
app.use(methodOverride());
app.use(express.json());
app.use('/', homeRoute);

const server = app.listen(process.env.PORT, () => {
  const { address, port } = server.address();
  console.log(`Your app is listening on ${address} at port ${port}`);
});

module.exports = server;
