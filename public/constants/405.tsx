const LANDLORD = 'Bon Huang';
const NUMBER = '(415)812-3147';
const EMAIL = 'astrotabon@gmail.com';

const tenants = [
  {
    name: 'Jorge Matias Bejarano',
    email: 'bejaranomatias1990@gmail.com',
    number: '(619)352-8338',
  },
  {
    name: 'Natalia Fernanoa Solaligue',
    email: 'natiisolaligue@gmail.com',
    number: '(415)200-8564',
  },
];
const address = '405 Piccadilly Place #31 San Bruno CA 94066';
const rent = '$2,050.00';
const deposit = '$2,000.00';
const moveInFee = {
  description: '',
  amount: 0,
};

const lateFee = '$100.00';
const startDate = '03/01/2024';
const endDate = '02/28/2025';

export default {
  landlord: LANDLORD,
  number: NUMBER,
  email: EMAIL,
  address,
  startDate,
  endDate,
  tenants,
  rent,
  deposit,
  moveInFee,
  summary: [
    { field: 'Property Address', value: address },
    { field: 'Lease Start Date', value: startDate },
    { field: 'Lease End Date', value: endDate },
    { field: 'Total Monthly Rent', value: rent },
    { field: 'Total Deposit', value: deposit },
    // {field: `Move-in Fee ${moveInFee.description}`, value: moveInFee.amount},
    { field: 'Late Fee', value: lateFee },
  ],
};
