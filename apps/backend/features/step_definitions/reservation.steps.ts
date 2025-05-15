import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect } from 'chai';
import pactum from 'pactum';
import { UserService } from '../../src/services/user.service';
import { ReservationService } from '../../src/services/reservation.service';
import { UserRole } from '../../src/types/user';
import bcrypt from 'bcryptjs';

const TEST_URL = 'http://localhost:4000/api';
const userService = new UserService();
const reservationService = new ReservationService();
let response: any;
let authToken: string;

Before(async function() {
  pactum.request.setBaseUrl(TEST_URL);
});

Before(async function() {
  // Clean up all test data
  await reservationService.deleteAllReservations();
  await userService.deleteAllUsers();
});


Given('I am logged in as {string}', async function(phone) {
  const user = await userService.findByPhone(phone);
  if (!user) {
    throw new Error('User not found');
  }
  const loginResponse = await pactum.spec()
    .post('/auth/login')
    .withJson({
      phone: user.phone,
      password: 'pass123'
    })
    .expectStatus(200)
    .toss();
  
  authToken = loginResponse.body.token;
  pactum.request.setDefaultHeaders('Authorization', `Bearer ${authToken}`);
});

Given('the system has a user with phone {string}', async function(phone) {
  const hashedPassword = await bcrypt.hash('pass123', 10);
  await userService.createUser({
    email: `${phone}@test.com`,
    password: hashedPassword,
    name: 'Test User',
    phone,  
    role: UserRole.GUEST
  });
});

Given('there is a reservation with status {string}', async function(status) {
  const user = await userService.findByPhone('1234567890');
  if (!user || !user._id) {
    throw new Error('User not found or invalid');
  }
  const reservation = await reservationService.createReservation({
    guestId: user._id.toString(),
    expectedArrival: new Date('2024-03-20T19:00:00Z'),
    tableSize: 4
  });
  if (!reservation || !reservation._id) {
    throw new Error('Reservation creation failed');
  }
  this.reservationId = reservation._id.toString();
});

Given('there is a reservation owned by {string}', async function(email) {
  const user = await userService.findByEmail(email);
  if (!user || !user._id) {
    throw new Error('User not found or invalid');
  }
  const reservation = await reservationService.createReservation({
    guestId: user._id.toString(),
    expectedArrival: new Date('2024-03-20T19:00:00Z'),
    tableSize: 4
  });
  if (!reservation || !reservation._id) {
    throw new Error('Reservation creation failed');
  }
  this.reservationId = reservation._id.toString();
});

Given('there are reservations for {string}', async function(date) {
  const guest = await userService.findByPhone('1234567890');
  const otherGuest = await userService.findByPhone('1987654321');
  
  if (!guest || !guest._id || !otherGuest || !otherGuest._id) {
    throw new Error('Required users not found');
  }
  
  await reservationService.createReservation({
    guestId: guest._id.toString(),
    expectedArrival: new Date(Date.now() + 1000 * 60 * 60 * 2),
    tableSize: 4
  });
  
  await reservationService.createReservation({
    guestId: otherGuest._id.toString(),
    expectedArrival: new Date(Date.now() + 1000 * 60 * 60 * 2),
    tableSize: 2
  });
});

When('I send a GraphQL mutation {string} with:', async function(mutation, docString) {
  const variables = JSON.parse(docString);
  if (variables.id === 'RESERVATION_ID') {
    variables.id = this.reservationId;
  }

  let query;
  if (mutation === 'createReservation') {
    query = `
      mutation ${mutation}($input: CreateReservationInput!) {
        ${mutation}(input: $input) {
          _id
          expectedArrival
          tableSize
          status
          createdAt
          updatedAt
        }
      }
    `;
  } else if (mutation === 'updateReservation') {
    query = `
      mutation ${mutation}($id: ID!, $input: UpdateReservationInput!) {
        ${mutation}(id: $id, input: $input) {
          _id
          expectedArrival
          tableSize
          status
          createdAt
          updatedAt
        }
      }
    `;
  } else if (mutation === 'cancelReservation') {
    query = `
      mutation ${mutation}($id: ID!) {
        ${mutation}(id: $id) {
          _id
          expectedArrival
          tableSize
          status
          createdAt
          updatedAt
        }
      }
    `;
  }

  response = await pactum.spec()
    .post('/graphql')
    .withJson({
      query,
      variables
    })
    .toss();
});

When('I send a GraphQL query {string} with:', async function(query, docString) {
  const variables = JSON.parse(docString);
  const queryString = `
    query ${query}($date: String, $status: String) {
      ${query}(date: $date, status: $status) {
        _id
        expectedArrival
        tableSize
        status
        createdAt
        updatedAt
      }
    }
  `;

  response = await pactum.spec()
    .post('/graphql')
    .withJson({
      query: queryString,
      variables
    })
    .toss();
});

Then('the response should contain the reservation information', function() {
  console.log('----------', response.body)
  const data = response.body.data?.createReservation || response.body.data?.updateReservation || response.body.data?.cancelReservation;
  expect(data).to.have.property('_id');
  expect(data).to.have.property('expectedArrival');
  expect(data).to.have.property('tableSize');
  expect(data).to.have.property('status');
  expect(data).to.have.property('createdAt');
  expect(data).to.have.property('updatedAt');
});

Then('the reservation status should be {string}', function(status) {
  const data = response.body.data?.createReservation || response.body.data?.updateReservation || response.body.data?.cancelReservation;
  expect(data.status).to.equal(status);
});

Then('the response should contain a list of reservations', function() {
  const data = response.body.data?.reservations;
  expect(data).to.be.an('array');
  expect(data.length).to.be.greaterThan(0);
});

Then('all reservations should be for the date {string}', function(date) {
  const data = response.body.data?.reservations;
  data.forEach((reservation: any) => {
    const reservationDate = new Date(reservation.expectedArrival).toISOString().split('T')[0];
    expect(reservationDate).to.equal(date);
  });
});

Then('the response should contain the error {string}', function(message) {
  expect(response.body.errors?.[0]?.message || response.body.message).to.equal(message);
}); 