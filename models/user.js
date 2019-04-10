const { List, Map } = require('immutable');

const defaultUsers = [
  {
    id: 23568974210520,
    email: 'michealflan@gmail.com',
    firstName: 'Micheal',
    lastName: 'Flannigan',
    password: '$2a$10$k1R0B46hgPw66SSM5KxvWuO43S8zzAiwF8AeCoFhK5my1WdDFaF2W',
    type: 'client',
    isAdmin: false,
    status: 'inactive',
  }, {
    id: 36956655716265,
    email: 'johnwayne@gmail.com',
    firstName: 'John',
    lastName: 'Wayne',
    password: '$2a$10$bX.FnSxYI4fXkKMdoCTrFu/9kva9mhhRBmPCbsg2SZyd97LPvUVyy',
    type: 'staff',
    isAdmin: false,
    status: 'active',
  }, {
    id: 54875558726968,
    email: 'tylerross@gmail.com',
    firstName: 'Tyler',
    lastName: 'Ross',
    password: '$2a$10$XwPHfW.q4D7H9GjVnfn1d.I2YdDt3K5z1Hlgw6uoIlkCm.3v7nBmK',
    type: 'staff',
    isAdmin: true,
    status: 'active',
  }, {
    id: 65897567145632,
    email: 'jamesdonovan@gmail.com',
    firstName: 'James',
    lastName: 'Donovan',
    password: '$2a$10$MplULKcWDTam4a7w0zGvFeDEGPH6imABvfw3rFX8VTdcOtL8F3pES',
    type: 'client',
    isAdmin: false,
    status: 'active',
  },
];

const usersList = List(defaultUsers);
const users = usersList.map(user => Map(user));

module.exports = users;
