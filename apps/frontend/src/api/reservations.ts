import { gql } from '@apollo/client';
import { client } from '../lib/apollo';

export interface Reservation {
  id: string;
  date: string;
  status: string;
  guest: {
    id: string;
    name: string;
  };
}

const GET_RESERVATIONS = gql`
  query GetReservations {
    reservations {
      id
      date
      status
      guest {
        id
        name
      }
    }
  }
`;

export const getReservations = async (): Promise<Reservation[]> => {
  try {
    const { data } = await client.query({
      query: GET_RESERVATIONS,
    });
    return data.reservations;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return [];
  }
}; 