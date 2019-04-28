"use strict";

var _require = require('immutable'),
    List = _require.List,
    Map = _require.Map;

function dateTime(offset) {
  return new Date(Date.now() + offset);
}

var defaultAccounts = [{
  id: 58769874154475111,
  accountNumber: 2816408925,
  createdOn: dateTime(0),
  owner: 23568974210520,
  type: 'savings',
  status: 'active',
  balance: 500.00
}, {
  id: 37091127128041553,
  accountNumber: 2869502843,
  createdOn: dateTime(24 * 60 * 60 * 1000),
  owner: 65897567145632,
  type: 'current',
  status: 'draft',
  balance: 1000.00
}];
var accountList = List(defaultAccounts);
var accounts = accountList.map(function (user) {
  return Map(user);
});
module.exports = accounts;