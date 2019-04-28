import '@babel/polyfill';
import express from 'express';
import methodOverride from 'method-override';
import morgan from 'morgan';
import dotenv from 'dotenv';
import expressValidator from 'express-validator';
import expressOasGenerator from 'express-oas-generator';

import fs from 'fs';

/* -------- ROUTES ---------------- */
import appRoutes from './routes/index';
import catchAll from './routes/catchall';

dotenv.config();
const app = express();

// generate swagger docs when tests are run
const swaggerFile = `${__dirname}/swagger.json`;
console.log('FILE PATH: ', swaggerFile);

const genFile = (filePath, data) => {
  fs.writeFileSync(filePath,
    JSON.stringify(data, null, 2));
};

if (process.env.NODE_ENV === 'test') {
  expressOasGenerator.init(
    app,
    (spec) => {
      console.log('DOC SPEC: ', spec);
      genFile(swaggerFile, spec);
      return spec;
    },
    swaggerFile,
    60 * 1000,
  );
}

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}
app.use(methodOverride());
app.use(express.json());
app.use(express.urlencoded());
app.use(expressValidator());

app.use(`/api/${process.env.API_VERSION}`, appRoutes);
app.use('*', catchAll);


const server = app.listen(process.env.PORT, () => {
  const { address, port } = server.address();
  console.log(`Your app is listening on ${address} at port ${port}`);
});

export default server;
