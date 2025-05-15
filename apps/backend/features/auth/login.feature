Feature: User Authentication - Login
  As a user
  I want to log in to the system
  So that I can access my account

  Background:
    Given the system has the following users:
      | email          | password | name      | phone      | role     |
      | guest@test.com | pass123  | Test User | 1234567890 | guest    |
      | admin@test.com | admin123 | Admin     | 1987654321 | employee |

  Scenario: Successful login with valid credentials
    When I send a POST request to "/auth/login" with:
      """
      {
        "phone": "1234567890",
        "password": "pass123"
      }
      """
    Then the response status code should be 200
    And the response should contain a valid JWT token
    And the response should contain the user information

  Scenario: Failed login with invalid phone
    When I send a POST request to "/auth/login" with:
      """
      {
        "phone": "9999999999",
        "password": "pass123"
      }
      """
    Then the response status code should be 401
    And the response should contain the message "Invalid credentials"

  Scenario: Failed login with invalid password
    When I send a POST request to "/auth/login" with:
      """
      {
        "phone": "1234567890",
        "password": "wrongpass"
      }
      """
    Then the response status code should be 401
    And the response should contain the message "Invalid credentials"

  Scenario: Failed login with missing credentials
    When I send a POST request to "/auth/login" with:
      """
      {
        "phone": "1234567890"
      }
      """
    Then the response status code should be 400
    And the response should contain the message "Phone and password are required" 