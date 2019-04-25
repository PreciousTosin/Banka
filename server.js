import '@babel/polyfill';
import express from 'express';
import methodOverride from 'method-override';
import morgan from 'morgan';
import dotenv from 'dotenv';

/* -------- ROUTES ---------------- */
import appRoutes from './routes/index';

dotenv.config();
const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}
app.use(methodOverride());
app.use(express.json());
app.use(express.urlencoded());

app.use(`/${process.env.API_VERSION}`, appRoutes);


const server = app.listen(process.env.PORT, () => {
  const { address, port } = server.address();
  console.log(`Your app is listening on ${address} at port ${port}`);
});

export default server;
