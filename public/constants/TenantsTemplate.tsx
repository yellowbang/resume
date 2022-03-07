const tenants = [
  { name: '', email: '', number: ''},
];
const address = ''
const rent = '$1950.00';
const deposit = '$2000.00';
const moveInFee = {
  amount: '$0.00',
  description: 'Early Move In',
}

const lateFee = '$100.00';
const startDate = 'MM/DD/YYYY';
const endDate = 'MM/DD/YYYY';

export default {
  landlord: "",
  address,
  number: '',
  email: '',
  startDate,
  endDate,
  tenants,
  rent,
  deposit,
  moveInFee,
  summary: [
    {field: 'Property Address', value: address},
    {field: 'Lease Start Date', value: startDate},
    {field: 'Lease End Date', value: endDate},
    {field: 'Total Monthly Rent', value: rent},
    {field: 'Total Deposit', value: deposit},
    {field: `Move-in Fee ${moveInFee.description}`, value: moveInFee.amount},
    {field: 'Late Fee', value: lateFee},
  ],
}