const tenants = [
  { name: "Boyuan Feng", email: "boyuan@ucsb.edu", number: "" },
  { name: "Shu Yang", email: "shuyang1995@ucsb.edu", number: "(805)689-1961" },
];
const address = "211 Boardwalk Ave apt#E, San Bruno, CA 94066";
const rent = "$1950.00";
const deposit = "$2000.00";
const moveInFee = {
  amount: "$377.00",
  description: "Early Move In",
};

const lateFee = "$100.00";
const startDate = "04/01/2022";
const endDate = "04/01/2023";

export default {
  landlord: "Bon Huang",
  address,
  number: "(415)812-3147",
  email: "astrotabon@gmail.com",
  startDate,
  endDate,
  tenants,
  rent,
  deposit,
  moveInFee,
  summary: [
    { field: "Property Address", value: address },
    { field: "Lease Start Date", value: startDate },
    { field: "Lease End Date", value: endDate },
    { field: "Total Monthly Rent", value: rent },
    { field: "Total Deposit", value: deposit },
    { field: `Move-in Fee ${moveInFee.description}`, value: moveInFee.amount },
    { field: "Late Fee", value: lateFee },
  ],
};
