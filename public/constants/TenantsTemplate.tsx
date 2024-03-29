const LANDLORD = 'Bon Huang';
const NUMBER = '(415)812-3147';
const EMAIL = 'astrotabon@gmail.com';

const tenants = [{ name: '', email: '', number: '' }];
const address = '';
const rent = '$1,950.00';
const deposit = '$2,000.00';
const moveInFee = {
  amount: '$0.00',
  description: 'Early Move In',
};

const lateFee = '$100.00';
const startDate = 'MM/DD/YYYY';
const endDate = 'MM/DD/YYYY';

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
    { field: `Move-in Fee ${moveInFee.description}`, value: moveInFee.amount },
    { field: 'Late Fee', value: lateFee },
  ],
};
