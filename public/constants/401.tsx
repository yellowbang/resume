const LANDLORD = 'Ming Hua Huang';
const NUMBER = '(415)885-9124';
const EMAIL = 'jojoshiyunxia0307@gmail.com';

const tenants = [
  {
    name: 'Ahmed Jouini',
    email: 'jouinia959@gmail.com',
    number: '1(415)420-6078',
  },
  {
    name: 'Melody Flores',
    email: 'floresmelody23@yahoo.com',
    number: '1(585)406-8923',
  },
];
const address = '401 Piccadilly Place #23 San Bruno CA 94066';
const rent = '$2,000.00';
const deposit = '$2,000.00';
const moveInFee = {
  description: '',
  amount: 0,
};

const lateFee = '$100.00';
const startDate = '04/01/2024';
const endDate = '09/30/2024';

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
