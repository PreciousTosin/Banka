const { List, Map } = require('immutable');

function dateTime(offset) {
  return new Date(Date.now() + offset);
}

const defaultAccounts = [
  {
    id: 58769874154475111,
    accountNumber: 2816408925,
    createdOn: dateTime(0),
    owner: 23568974210520,
    type: 'savings',
    status: 'active',
    balance: 500.00,
  }, {
    id: 37091127128041553,
    accountNumber: 2869502843,
    createdOn: dateTime(24 * 60 * 60 * 1000),
    owner: 65897567145632,
    type: 'current',
    status: 'draft',
    balance: 1000.00,
  },
];

const accountList = List(defaultAccounts);
const accounts = accountList.map(user => Map(user));

module.exports = accounts;
