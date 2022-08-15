import React from 'react';
import moment from 'moment';
import details from '../public/constants/405';
import {
  specialProvisions,
  generalProvisions,
} from '../public/constants/Provisions';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/RentalAgreement.module.css';
import { Table } from 'react-bootstrap';

interface ISignatureItem {
  name: string;
  key?: string;
}
const SignatureItem = ({ name }: ISignatureItem) => {
  return (
    <div className={`${styles.signatureItem} d-flex w-100`}>
      Name: <div className={styles.signatureItemField}>{name}</div>
      Sign: <div className={styles.signatureItemField}>{}</div>
      Date: <div className={styles.signatureItemField}>{}</div>
    </div>
  );
};

interface IProvisionItem {
  title: string;
  description: string;
  key?: string;
}
const ProvisionItem = ({ title, description }: IProvisionItem) => {
  return (
    <li className={`${styles.provisionItem}`}>
      <h4>{title}</h4>
      <div>{description}</div>
    </li>
  );
};

const RentalAgreement = () => {
  const {
    landlord,
    address,
    tenants,
    summary,
    number,
    email,
    startDate,
    rent,
    deposit,
    moveInFee,
  } = details;
  const today = moment().format('MM/DD/YYYY');
  return (
    <div className={`${styles.rentalAgreement} a4-page d-flex flex-column`}>
      <h1 className="title">Rental Agreement</h1>
      <div className="d-flex align-items-center pb-3">
        <span className="px-1">Between:</span>
        <b>{landlord}</b>
        <span className="px-1">and</span>
        <b>{tenants.map((t) => t.name).join(', ')}</b>
      </div>
      <h2>Summary</h2>
      <ul>
        {summary.map((s) => (
          <li className={`${styles.noCounter} pt-2`} key={s.field}>
            {s.field}: <b>{s.value}</b>
          </li>
        ))}
      </ul>
      <h2 className="mt-5">California Residential Rental Agreement</h2>
      <ol>
        <li>
          <h3>GENERAL INFORMATION</h3>
          <ol>
            <li>
              <h4>DATE</h4>
              <div>
                The date of this Agreements is <b>{today}</b>
              </div>
            </li>
            <li>
              <h4>TENANT(S)</h4>
              <div>
                The Tenant(s) herein is/are:
                <div className="d-flex flex-column">
                  {tenants.map((t, i) => (
                    <div key={i}>
                      <b>{t.name}</b> ({t.email}; {t.number})
                    </div>
                  ))}
                </div>
              </div>
            </li>
            <li>
              <h4>LANDLORD</h4>
              <div>
                The Landlord herein is:
                <div className="d-flex flex-column">
                  <b>{landlord}</b> ({email}; {number})
                </div>
              </div>
            </li>
            <li>
              <h4>RENTAL PROPERTY</h4>
              <div>
                The Rental Property herein, known as (the “Premises”) is the
                structure or the part of a structure that is used as a home,
                residence, or sleeping place by the Tenant who maintains a
                household there.
                <div className="d-flex flex-column">
                  <b>{address}</b>
                </div>
              </div>
            </li>
            <li>
              <h4>TERM OF LEASE</h4>
              <div>The Term of Lease herein shall be as follows:</div>
              <div>
                Lease Start Date: <b>{startDate}</b>
              </div>
              <div>Lease Type:</div>
              <div className="ml-4">
                <input type="checkbox" checked={true} onChange={() => {}} />
                <b>Month-to-Month: </b>a month-to-month lease terminates by
                Landlord or Tenant giving the other party to this Agreement
                thirty days written notice.
              </div>
              <div className="ml-4">
                <input type="checkbox" />
                <b>Fixed Term: </b>for a period ending on: N/A
              </div>
              <div>
                In the event Fixed Term is selected above, upon expiration of
                term, Landlord and Tenant agree that the following shall occur
                by default:
              </div>
              <div className="ml-4">
                <input type="checkbox" />
                <b>Continue as Month-to-Month: </b>the lease shall automatically
                be renewed on a month-to-month basis.
              </div>
              <div className="ml-4">
                <input type="checkbox" />
                <b>Terminate: </b>the lease shall automatically terminate at the
                conclusion of the initial term of tenancy.
              </div>
            </li>
            <li>
              <h4>RENT</h4>
              <div>
                Rent for the term hereof shall be payable on the 1st day of each
                month of the term (Due Date), in equal installments of
                <b>{rent}</b>.
              </div>
            </li>
            <li>
              <h4>FORM OF RENT PAYMENTS</h4>
              <div>
                {`All payments shall be made to Landlord without demand at
                Landlord's mailing address such that they can be received on or
                before the Due Date. Landlord's acceptance of rent from a person
                other than the namedTenant shall not be a waiver of any right
                and shall not constitute acceptance of such person as a
                Tenant.Upon Landlord's receipt of a cash rental payment,
                Landlord shall provide a written receipt to Tenant and record
                the payment date and amount in a record book. All rent payments
                should be made via one of the following methods:`}
                <b>
                  {`Cash, Personal Check, Cashier's Check or Any (Vemo or Zelle).`}
                </b>
              </div>
            </li>
            <li>
              <h4>SECURITY DEPOSIT AND OTHER DEPOSITS</h4>
              <div>
                Upon the due execution of this Agreement, Tenant shall deposit
                with Landlord the following deposit amount(s): <b>{deposit}</b>
              </div>
            </li>
            {moveInFee.description !== '' && moveInFee.amount !== 0 ? (
              <li>
                <h4>NONREFUNDABLE FEES</h4>
                <div>
                  Upon the due execution of this Agreement, Tenant shall pay to
                  Landlord the following non-refundable fee(s):
                  <b>
                    {moveInFee.description} {moveInFee.amount}
                  </b>
                </div>
              </li>
            ) : null}
            <li>
              <h4>UTILITIES AND SERVICES</h4>
              <div>
                Landlord and Tenant agree that utilities and other services will
                be the responsibility of, and paid for by,Tenant, as additional
                rent, as outlined below:
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Utility or Service</th>
                      <th>Responsibility</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Electric</td>
                      <td>Tenant</td>
                    </tr>
                    <tr>
                      <td>Internet</td>
                      <td>Tenant</td>
                    </tr>
                    <tr>
                      <td>Phone</td>
                      <td>Tenant</td>
                    </tr>
                    <tr>
                      <td>Cable / Satellite</td>
                      <td>Tenant</td>
                    </tr>
                    <tr>
                      <td>Gas</td>
                      <td>Tenant</td>
                    </tr>
                    <tr>
                      <td>Water</td>
                      <td>Landlord</td>
                    </tr>
                    <tr>
                      <td>Sewer / Septic</td>
                      <td>Landlord</td>
                    </tr>
                    <tr>
                      <td>Trash</td>
                      <td>Landlord</td>
                    </tr>
                    <tr>
                      <td>Lawn Care</td>
                      <td>N/A</td>
                    </tr>
                    <tr>
                      <td>Snow Removal</td>
                      <td>N/A</td>
                    </tr>
                    <tr>
                      <td>Lawn Care</td>
                      <td>Landlord</td>
                    </tr>
                    <tr>
                      <td>HOA or Condo Dues</td>
                      <td>Landlord</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <div>
                {`Tenant's obligation to pay the above named utilities shall
                include any and all seasonal fees, late fees,installation or
                connection fees and maintenance charges. Failure by Tenant to
                comply with the above responsibility for utilities will
                constitute a default in the terms of this Agreement and Landlord
                may terminate this Agreement. If Tenant fails to notify the
                service provider or does not assume responsibility of billing as
                of the effective date of the Agreement start or cancels the
                utilities prior to the date of Agreement termination,which
                results in the account being billed to Landlord, Tenant's
                utilities will be paid and charged back toTenant as additional
                rent.`}
              </div>
            </li>
            <li>
              <h4>SMOKING</h4>
              <div>
                The Premises are designated as a property where smoking is
                <b>Not Permitted.</b>
              </div>
              <div>
                {`For the purposes of clarifying and restricting its use, the term
                “Smoking” includes the use of cigarettes,pipes, cigars,
                electronic vaporizing or aerosol devices, or other devices
                intended for the inhalation of tobacco, marijuana, or similar
                substances. Tenant understands and agrees that any damage caused
                by smoking shall not constitute ordinary wear and tear. Landlord
                may deduct from Tenant's security deposit all damages and/or
                costs for the cleaning or repairing of any damage caused by or
                related to smoking,including but not limited to: deodorizing the
                Premises, sealing and painting the walls and ceiling, and/or
                repairing or replacing the carpet and pads.`}
              </div>
            </li>

            <li>
              <h4>TENANT INSURANCE</h4>
              <div>
                <div className="ml-4">
                  <input type="checkbox" />
                  <b>
                    Required to buy and maintain renters or liability insurance.
                  </b>
                  Tenant shall provide Landlord with evidence of required
                  insurance prior to Tenant moving into Premises and upon
                  request during theTerm.
                </div>
                <div className="ml-4">
                  <input type="checkbox" checked={true} onChange={() => {}} />
                  <b>Not required to buy renters or liability insurance, </b>
                  {`however it is strongly recommended to protectTenant, Tenant's
                  family, Tenant's invitees, and/or guests, and all personal
                  property on the Premises and/or in any common areas from any
                  and all damages.`}
                </div>
              </div>
            </li>
            <li>
              <h4>KEYS</h4>
              <div>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Key Type</th>
                      <th>Number of Copies</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Property</td>
                      <td>2</td>
                    </tr>
                    <tr>
                      <td>Mailbox</td>
                      <td>1</td>
                    </tr>
                    <tr>
                      <td>Laundry</td>
                      <td>1</td>
                    </tr>
                    <tr>
                      <td>Facilities (Gym, Swimming Pool and Tennis)</td>
                      <td>1</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </li>
            <li>
              <h4>ADDITIONAL TERMS</h4>
              <div>
                The following additional terms will become a part of this
                Agreement and will supersede any conflicting terms of this
                Agreement: N/A
              </div>
            </li>
          </ol>
        </li>
        <li>
          <h3>SPECIAL PROVISIONS</h3>
          <div>
            THE PARTIES FURTHER AGREE TO THE FOLLOWING SPECIAL PROVISIONS:
          </div>
          <ol>
            {specialProvisions.map((sp) => (
              <ProvisionItem
                key={sp.title}
                title={sp.title}
                description={sp.description}
              />
            ))}
          </ol>
        </li>
        <li>
          <h3>GENERAL PROVISIONS</h3>
          <div>
            THE PARTIES FURTHER AGREE TO THE FOLLOWING SPECIAL PROVISIONS:
          </div>
          <ol>
            {generalProvisions.map((gp) => (
              <ProvisionItem
                key={gp.title}
                title={gp.title}
                description={gp.description}
              />
            ))}
          </ol>
        </li>
        <li>
          <h3>SIGNATURES</h3>
          <div>
            THE TENANT UNDERSTANDS THAT THE EXECUTION OF THIS AGREEMENT ENTAILS
            AN IMPORTANT DECISION THAT HAS LEGAL IMPLICATIONS. TENANT IS ADVISED
            TO SEEK HIS OR HER OWN COUNSEL, LEGAL OR OTHERWISE, REGARDING THE
            EXECUTION OF THIS AGREEMENT. TENANT HEREBY ACKNOWLEDGES THAT HE OR
            SHE HAS READ THIS AGREEMENT,UNDERSTANDS IT, AGREES TO IT, AND HAS
            BEEN GIVEN A COPY. ELECTRONIC SIGNATURES MAYBE USED TO EXECUTE THIS
            AGREEMENT. IF USED, THE PARTIES ACKNOWLEDGE THAT ONCE THE ELECTRONIC
            SIGNATURE PROCESS IS COMPLETED, THE ELECTRONIC SIGNATURES ON THIS
            AGREEMENT WILL BE AS BINDING AS IF THE SIGNATURES WERE PHYSICALLY
            SIGNED BY HAND
          </div>
          <div>
            WITNESS THE SIGNATURES OF THE PARTIES TO THIS RENTAL AGREEMENT:
          </div>
          <div>TENANT(S):</div>
          {tenants.map((t) => (
            <SignatureItem key={t.name} name={t.name}></SignatureItem>
          ))}
          <div className="mt-4">LANDLORD(S):</div>
          <SignatureItem name={landlord}></SignatureItem>
        </li>
      </ol>
    </div>
  );
};

export default RentalAgreement;
