import NodePostgres from 'pg';
import dotenv from 'dotenv';

const { Pool } = NodePostgres;

dotenv.config();

const devConfig = {
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
};

// eslint-disable-next-line no-unused-vars
const prodConfig = {
  connectionString: process.env.DATABASE_URL,
};

const pool = new Pool(process.env.NODE_ENV === 'development' ? devConfig : devConfig);

export default {
  query(text, params = []) {
    return new Promise((resolve, reject) => {
      pool.query(text, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  transaction(queryOne, queryTwo) {
    let queryOneResults = '';
    let queryTwoResults = '';
    return new Promise((resolve, reject) => {
      pool.query('BEGIN')
        .then(() => queryOne())
        .then((one) => {
          queryOneResults = one;
          return queryTwo();
        })
        .then((two) => {
          queryTwoResults = two;
          return pool.query('COMMIT');
        })
        .then(() => resolve([queryOneResults, queryTwoResults]))
        .catch(error => pool.query('ROLLBACK')
          .catch(err => reject(err))
          .then(() => {
            console.log('ROLLBACK ERROR: ', error);
            reject(error);
          }));
    });
  },
};
