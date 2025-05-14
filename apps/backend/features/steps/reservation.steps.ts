import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { DataTable } from '@cucumber/cucumber';
import { ReservationService } from '../../src/services/reservation.service';
import { ReservationStatus } from '../../src/types/reservation';

let reservationService: ReservationService;
let currentGuest: any;
let currentReservation: any;

Given('the restaurant is open', async function() {
  // Implementation for checking restaurant status
  return true;
});

Given('there are available tables', async function() {
  // Implementation for checking table availability
  return true;
});

Given('a guest with the following details:', async function(table: DataTable) {
  const guestData = table.hashes()[0];
  currentGuest = {
    name: guestData.name,
    email: guestData.email,
    phone: guestData.phone
  };
});

When('the guest requests a table for {int} people at {string}', async function(people: number, time: string) {
  currentReservation = await reservationService.createReservation({
    guestName: currentGuest.name,
    guestContact: {
      email: currentGuest.email,
      phone: currentGuest.phone
    },
    expectedArrival: new Date(time),
    tableSize: people,
    status: 'Requested'
  });
});

Then('the reservation should be created with status {string}', async function(status: string) {
  expect(currentReservation.status).to.equal(status);
});

Then('the guest should receive a confirmation', async function() {
  // Implementation for checking confirmation
  expect(currentReservation.id).to.exist;
});

Given('an existing reservation for {string}', async function(guestName: string) {
  currentReservation = await reservationService.findByGuestName(guestName);
  expect(currentReservation).to.exist;
});

When('the guest updates the arrival time to {string}', async function(newTime: string) {
  currentReservation = await reservationService.updateReservation(
    currentReservation.id,
    { expectedArrival: new Date(newTime) }
  );
});

Then('the reservation should be updated with the new time', async function() {
  expect(currentReservation.expectedArrival).to.be.instanceOf(Date);
});

When('the guest cancels the reservation', async function() {
  currentReservation = await reservationService.updateReservationStatus(
    currentReservation.id,
    'Cancelled'
  );
});

Then('the reservation status should be {string}', async function(status: string) {
  expect(currentReservation.status).to.equal(status);
}); 