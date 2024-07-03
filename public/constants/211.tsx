type NonEmptyString = string & { length: Exclude<keyof string, 'length'> };

type Tenant = {
  name: string;
  email: NonEmptyString;
  number: NonEmptyString;
};

const tenants: Tenant[] = [
  {
    name: 'Jieun Che',
    email: 'jeche1012@gmail.com',
    number: '(415)602-3691',
  },
];
const address = '211 Boardwalk Ave apt#E, San Bruno, CA 94066';
const rent = '$2050.00';
const deposit = '$2050.00';
const moveInFee: {
  amount: number;
  description: string;
} = {
  amount: 0,
  description: '',
};

const lateFee = '$100.00';
const startDate = '01/01/2024';
const endDate = '01/01/2025';

const infos = {
  landlord: 'Yunxia Shi',
  address,
  number: '(415)885-9124',
  email: 'jojoshiyunxia0307@gmail.com',
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

export default infos;
