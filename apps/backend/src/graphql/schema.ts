
export const typeDefs = `#graphql
  enum UserRole {
    guest
    employee
    admin
  }

  type Reservation {
    _id: ID!
    guest: User!
    expectedArrival: String!
    tableSize: Int!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    _id: ID!
    email: String!
    name: String!
    phone: String!
    role: UserRole!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input CreateReservationInput {
    expectedArrival: String!
    tableSize: Int!
  }

  input UpdateReservationInput {
    expectedArrival: String
    tableSize: Int
    status: String
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
    reservations(date: String, status: String): [Reservation!]!
    reservation(id: ID!): Reservation
    me: User
  }

  type Mutation {
    createReservation(input: CreateReservationInput!): Reservation!
    updateReservation(id: ID!, input: UpdateReservationInput!): Reservation
    cancelReservation(id: ID!): Reservation
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
  }
`; 