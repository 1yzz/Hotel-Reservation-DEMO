Feature: User Registration
  As a new user
  I want to be able to register for an account
  So that I can use the reservation system

  Background:
    Given the system has no existing users

  Scenario: Successful registration with valid data
    When I send a POST request to "/auth/register" with:
      """
      {
        "email": "newuser@test.com",
        "password": "newpass123",
        "name": "New User",
        "phone": "1234567890"
      }
      """
    Then the response status code should be 201
    And the response should contain a valid JWT token
    And the response should contain the user information
    And the user should be created with role "guest"

  Scenario: Failed registration with existing email
    Given the system has a user with email "existing@test.com"
    When I send a POST request to "/auth/register" with:
      """
      {
        "email": "existing@test.com",
        "password": "pass123",
        "name": "Existing User",
        "phone": "1234567890"
      }
      """
    Then the response status code should be 400
    And the response should contain the message "Email already registered"

  Scenario: Failed registration with invalid email format
    When I send a POST request to "/auth/register" with:
      """
      {
        "email": "invalid-email",
        "password": "pass123",
        "name": "Invalid User",
        "phone": "1234567890"
      }
      """
    Then the response status code should be 400
    And the response should contain the message "Invalid email format"

  Scenario: Failed registration with invalid phone format
    When I send a POST request to "/auth/register" with:
      """
      {
        "email": "user@test.com",
        "password": "pass123",
        "name": "Invalid User",
        "phone": "123"
      }
      """
    Then the response status code should be 400
    And the response should contain the message "Invalid phone format"

  Scenario: Failed registration with missing required fields
    When I send a POST request to "/auth/register" with:
      """
      {
        "email": "user@test.com",
        "password": "pass123"
      }
      """
    Then the response status code should be 400
    And the response should contain the message "Email, password, name, and phone are required" 