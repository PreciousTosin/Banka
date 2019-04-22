const { List, Map } = require('immutable');

const defaultTransactions = [
  {
    id: 61287962375006273000,
    createdOn: '2019-04-09T13:10:55.052Z',
    type: 'credit',
    accountNumber: 2816408925,
    cashier: 36956655716265,
    amount: 150,
    oldBalance: 350,
    newBalance: 500,
  },
];

const transactionList = List(defaultTransactions);
module.exports = transactionList.map(transaction => Map(transaction));
