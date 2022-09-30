import { PLACEHOLDER } from "./Provisions";

const LANDLORD = 'Ming Hua Huang';
const NUMBER = '(415)885-9124';
const EMAIL = 'jojoshiyunxia0307@gmail.com';

const tenants = [
  {
    name: PLACEHOLDER,
    email: PLACEHOLDER,
    number: PLACEHOLDER,
  },
];
const address = '401 Piccadilly Place #23 San Bruno CA 94066';
const rent = '$2,000.00';
const deposit = '$2,300.00';
const moveInFee = {
  description: '',
  amount: 0,
};

const lateFee = '$100.00';
const startDate = '10/01/2022';
const endDate = '10/01/2023';

const rentailDetail401 =  {
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

export default rentailDetail401