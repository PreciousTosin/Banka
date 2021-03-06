import Decimal from 'decimal.js';
import queryDb from '../query';
import account from './account';

const makeTransactionId = () => {
  let text = '';
  const possible = '0123456789';
  for (let i = 0; i < 6; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return Number(text);
};

const returnCurrentDateTime = () => new Date(Date.now());

class Transaction {
  static create(payload, accountInformationRes) {
    const accountInformation = accountInformationRes[0];
    return new Promise((resolve, reject) => {
      const oldBalance = new Decimal(accountInformation.balance);
      let newBalance = 0;
      if (payload.type === 'credit') {
        newBalance = Number(oldBalance.add(payload.amount).toFixed(2));
      } else if (Number(oldBalance) < Number(payload.amount)) {
        throw new Error('Account balance is insufficient');
      } else {
        newBalance = Number(oldBalance.minus(payload.amount).toFixed(2));
      }

      // transaction payload update
      const update = {
        id: makeTransactionId(),
        createdOn: returnCurrentDateTime(),
        type: payload.type,
        accountNumber: accountInformation.accountnumber,
        cashier: payload.cashier,
        amount: Number(payload.amount),
        oldBalance: Number(oldBalance.toFixed(2)),
        newBalance,
      };
      const queryText = `INSERT INTO transactions(id, createdOn, type, accountNumber, cashier, amount, oldBalance, newBalance)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8);`;
      const params = Object.values(update);
      // create transaction
      const createTransaction = () => queryDb.query(queryText, params);
      // UPDATE ACCOUNT BALANCE
      const updateAccount = () => account.update(update.accountNumber, {
        balance: newBalance,
      });
      // Perform atomic transaction
      queryDb.transaction(createTransaction, updateAccount)
        .then((results) => {
          const createTxOperation = results[0];
          const updateAccOperation = results[1];
          if (createTxOperation.rowCount !== 1) {
            throw new Error('Transaction failed');
          }
          resolve([update, updateAccOperation]);
        })
        .catch(error => reject(error));
    });
  }

  static findOneById(id) {
    return new Promise((resolve, reject) => {
      const queryText = `SELECT * FROM Transactions WHERE id=${id};`;
      queryDb.query(queryText)
        .then((res) => {
          resolve(res.rows);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findAll() {
    return new Promise((resolve, reject) => {
      const queryText = 'SELECT * FROM Transactions;';
      queryDb.query(queryText)
        .then((res) => {
          resolve(res.rows);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  static findAllByEmail(email) {
    return new Promise((resolve, reject) => {
      const txPromise = [];
      account.findAllAccountsByEmail(email).then((res) => {
        res.forEach((bankAccount) => {
          const queryText = `SELECT * FROM Transactions WHERE accountNumber=${bankAccount.accountnumber};`;
          txPromise.push(queryDb.query(queryText));
        });
        return Promise.all(txPromise);
      })
        .then((res) => {
          const txArr = [];
          res.forEach((accountRes) => {
            txArr.push(...accountRes.rows);
          });
          return txArr;
        })
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  static findAllByAccount(accountNumber) {
    return new Promise((resolve, reject) => {
      const queryText = `SELECT * FROM Transactions WHERE accountNumber=${accountNumber};`;
      queryDb.query(queryText)
        .then((res) => {
          resolve(res.rows);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  static delete(id) {
    let transactionPayload = '';
    return new Promise((resolve, reject) => {
      const queryText = `DELETE FROM Transactions WHERE id=${id};`;
      queryDb.query(`SELECT * FROM Transactions WHERE id=${id};`)
        .then((res) => {
          transactionPayload = res.rows;
          return queryDb.query(queryText);
        })
        .then((res) => {
          if (res.rowCount === 1) {
            resolve(transactionPayload);
          }
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}

export default Transaction;
