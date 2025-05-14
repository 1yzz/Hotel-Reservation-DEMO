import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import { ReservationService } from '../services/reservation.service';
import { UserService } from '../services/user.service';
import { UserRole } from '../entities/user.entity';
import { ReservationStatus } from '../types/reservation';

interface Context {
  user: any;
}

export const resolvers = {
  Query: {
    reservations: async (_: any, { date, status }: { date?: string; status?: ReservationStatus }, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated');
      }

      const reservationService = new ReservationService();
      await reservationService.initialize();

      if (date) {
        return reservationService.findByDate(new Date(date));
      }
      if (status) {
        return reservationService.findByStatus(status);
      }
      return reservationService.findAll();
    },

    reservation: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated');
      }

      const reservationService = new ReservationService();
      await reservationService.initialize();
      return reservationService.findById(id);
    },

    me: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated');
      }
      return context.user;
    },
  },

  Mutation: {
    createReservation: async (_: any, { input }: any, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated');
      }

      const reservationService = new ReservationService();
      await reservationService.initialize();

      return reservationService.createReservation({
        ...input,
        expectedArrival: new Date(input.expectedArrival),
        status: ReservationStatus.REQUESTED,
      });
    },

    updateReservation: async (_: any, { id, input }: { id: string; input: any }, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated');
      }

      const reservationService = new ReservationService();
      await reservationService.initialize();

      const reservation = await reservationService.findById(id);
      if (!reservation) {
        throw new GraphQLError('Reservation not found');
      }

      // Check authorization
      if (context.user.role === UserRole.GUEST) {
        if (reservation.guestId !== context.user.id) {
          throw new GraphQLError('Not authorized to update this reservation');
        }
        if (input.status) {
          throw new GraphQLError('Guests cannot update reservation status');
        }
      } else if (context.user.role === UserRole.EMPLOYEE || context.user.role === UserRole.ADMIN) {
        if (input.expectedArrival || input.tableSize) {
          throw new GraphQLError('Employees can only update reservation status');
        }
      }

      return reservationService.updateReservation(id, {
        ...input,
        expectedArrival: input.expectedArrival ? new Date(input.expectedArrival) : undefined,
      });
    },

    cancelReservation: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated');
      }

      const reservationService = new ReservationService();
      await reservationService.initialize();

      const reservation = await reservationService.findById(id);
      if (!reservation) {
        throw new GraphQLError('Reservation not found');
      }

      if (context.user.role === UserRole.GUEST && reservation.guestId !== context.user.id) {
        throw new GraphQLError('Not authorized to cancel this reservation');
      }

      return reservationService.updateReservationStatus(id, ReservationStatus.CANCELLED);
    },
  },
}; 