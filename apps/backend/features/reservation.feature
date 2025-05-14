Feature: Table Reservation System
  As a guest
  I want to make a table reservation
  So that I can dine at the restaurant

  Background:
    Given the restaurant is open
    And there are available tables

  Scenario: Guest makes a successful reservation
    Given a guest with the following details:
      | name    | email           | phone        |
      | John Doe| john@email.com  | 1234567890   |
    When the guest requests a table for 4 people at "2024-03-20 19:00"
    Then the reservation should be created with status "Requested"
    And the guest should receive a confirmation

  Scenario: Guest updates their reservation
    Given an existing reservation for "John Doe"
    When the guest updates the arrival time to "2024-03-20 20:00"
    Then the reservation should be updated with the new time
    And the guest should receive an update confirmation

  Scenario: Guest cancels their reservation
    Given an existing reservation for "John Doe"
    When the guest cancels the reservation
    Then the reservation status should be "Cancelled"
    And the guest should receive a cancellation confirmation 