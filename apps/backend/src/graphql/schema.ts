import { gql } from 'graphql-tag';

export const typeDefs = gql`
  enum ReservationStatus {
    requested
    approved
    cancelled
    completed
  }

  enum UserRole {
    guest
    employee
    admin
  }

  type Reservation {
    id: ID!
    guestId: ID!
    expectedArrival: String!
    tableSize: Int!
    status: ReservationStatus!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    id: ID!
    email: String!
    name: String!
    role: UserRole!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input CreateReservationInput {
    guestId: ID!
    expectedArrival: String!
    tableSize: Int!
  }

  input UpdateReservationInput {
    expectedArrival: String
    tableSize: Int
    status: ReservationStatus
  }

  input RegisterInput {
    phone: String!
    email: String!
    password: String!
    name: String!
  }

  input LoginInput {
    phone: String!
    password: String!
  }

  type Query {
    reservations(date: String, status: ReservationStatus): [Reservation!]!
    reservation(id: ID!): Reservation
    me: User
  }

  type Mutation {
    createReservation(input: CreateReservationInput!): Reservation!
    updateReservation(id: ID!, input: UpdateReservationInput!): Reservation!
    cancelReservation(id: ID!): Reservation!
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
  }
`; 