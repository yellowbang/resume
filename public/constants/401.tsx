const LANDLORD = 'Yunxia Shi';
const NUMBER = '(415)885-9124';
const EMAIL = 'jojoshiyunxia0307@gmail.com';

const tenants = [
  {
    name: 'MAURICIO RICARDO LOPEZ ESPANA',
    email: 'mauriciole69@gmail.com',
    number: '(650)333-2994',
  },
  {
    name: 'ZULEIRA MARCELA CORREA OSPINO',
    email: 'zmcorreao@gmail.com',
    number: '(650)333-2994',
  },
];
const address = '401 Piccadilly Place #23 San Bruno CA 94066';
const rent = '$2150.00';
const deposit = '$2150.00';
const moveInFee = {
  description: '',
  amount: 0,
};

const lateFee = '$100.00';
const startDate = '05/01/2025';
const endDate = '04/30/2026';

const rentalDetail401 = {
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

export default rentalDetail401;
