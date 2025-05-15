import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect } from 'chai';
import pactum from 'pactum';
import { UserService } from '../../src/services/user.service';
import { UserRole } from '../../src/types/user';
import bcrypt from 'bcryptjs';

const TEST_URL = 'http://localhost:4000/api';
const userService = new UserService();
let response: any;

Before(async function() {
  pactum.request.setBaseUrl(TEST_URL);
});

Given('the system has no existing users', async function() {
  await userService.deleteAllUsers();
});

Given('the system has the following users:', async function(dataTable) {
  for (const row of dataTable.hashes()) {
    const hashedPassword = await bcrypt.hash(row.password, 10);
    await userService.createUser({
      email: row.email,
      password: hashedPassword,
      name: row.name,
      phone: row.phone,
      role: UserRole.GUEST
    });
  }
});

When('I send a POST request to {string} with:', async function(endpoint, docString) {
  const data = JSON.parse(docString);
  response = await pactum.spec()
    .post(endpoint)
    .withJson(data)
    .toss();
});

Then('the response status code should be {int}', function(statusCode) {
  expect(response.statusCode).to.equal(statusCode);
});

Then('the response should contain the message {string}', function(message) {
  expect(response.body.message || response.body.errors?.[0]?.message).to.equal(message);
});

Then('the response should contain a valid JWT token', function() {
  expect(response.body).to.have.property('token');
  expect(response.body.token).to.be.a('string');
});

Then('the response should contain the user information', function() {
  expect(response.body).to.have.property('user');
  expect(response.body.user).to.have.property('email');
  expect(response.body.user).to.have.property('name');
  expect(response.body.user).to.have.property('role');
});

Then('the user should be created with role {string}', async function(role) {
  const user = await userService.findByEmail(response.body.user.email);
  if (!user) {
    throw new Error('User not found');
  }
  expect(user.role).to.equal(role === 'employee' ? UserRole.EMPLOYEE : UserRole.GUEST);
});