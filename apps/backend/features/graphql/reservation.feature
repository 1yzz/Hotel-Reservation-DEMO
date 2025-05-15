Feature: Reservation Management
  As a user
  I want to manage restaurant reservations
  So that I can book and manage my dining experience

  Background:
    Given the system has the following users:
      | email          | password | name  | phone      | role     |
      | guest@test.com | pass123  | Guest | 1234567890 | guest    |
      | staff@test.com | pass123  | Staff | 1987654321 | employee |
      | other@test.com | pass123  | Other | 9876543210 | guest    |

  Scenario: Guest creates a new reservation
    Given I am logged in as "1234567890"
    When I send a GraphQL mutation "createReservation" with:
      """
      {
        "input": {
          "expectedArrival": "2025-05-15T18:00",
          "tableSize": 4
        }
      }
      """
    Then the response should contain the reservation information
    And the reservation status should be "requested"

  Scenario: Guest cannot create reservation without authentication
    When I send a GraphQL mutation "createReservation" with:
      """
      {
        "input": {
          "expectedArrival": "2025-05-15T18:00",
          "tableSize": 4
        }
      }
      """
    Then the response should contain the error "Not authenticated"

  Scenario: Staff updates reservation status
    Given I am logged in as "1987654321"
    And there is a reservation with status "requested"
    When I send a GraphQL mutation "updateReservation" with:
      """
      {
        "id": "RESERVATION_ID",
        "input": {
          "status": "approved"
        }
      }
      """
    Then the response should contain the reservation information
    And the reservation status should be "approved"

  Scenario: Staff cannot update reservation details
    Given I am logged in as "1987654321"
    And there is a reservation with status "requested"
    When I send a GraphQL mutation "updateReservation" with:
      """
      {
        "id": "RESERVATION_ID",
        "input": {
          "tableSize": 6,
          "expectedArrival": "2025-05-15T18:23:00",
        }
      }
      """
    Then the response should contain the error "Employees can only update reservation status"

  Scenario: Guest cancels their reservation
    Given I am logged in as "1234567890"
    And there is a reservation owned by "guest@test.com"
    When I send a GraphQL mutation "cancelReservation" with:
      """
      {
        "id": "RESERVATION_ID"
      }
      """
    Then the response should contain the reservation information
    And the reservation status should be "cancelled"

  Scenario: Guest cannot cancel another guest's reservation
    Given I am logged in as "1234567890"
    And there is a reservation owned by "other@test.com"
    When I send a GraphQL mutation "cancelReservation" with:
      """
      {
        "id": "RESERVATION_ID"
      }
      """
    Then the response should contain the error "Not authorized to update this reservation"

  Scenario: Query reservations by date
    Given I am logged in as "1234567890"
    And there are reservations for "2025-05-15"
    When I send a GraphQL query "reservations" with:
      """
      {
        "date": "2025-05-15"
      }
      """
    Then the response should contain a list of reservations
    And all reservations should be for the date "2025-05-15" 