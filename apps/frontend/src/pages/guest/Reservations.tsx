import { createSignal, createEffect, Show } from 'solid-js';
import { A } from '@solidjs/router';
import { Reservation, ReservationStatus } from '../../types/reservation';
import { useAuth } from '../../hooks/useAuth';
import './Reservations.css';

const GuestReservations = () => {
  const [reservations, setReservations] = createSignal<Reservation[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const { user } = useAuth();

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/graphql ', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query MyReservations {
              reservations {
                _id
                expectedArrival
                tableSize
                status
              }
            }
          `,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch reservations');

      const data = await response.json();
      setReservations(data?.data?.reservations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (id: string) => {
    try {
      const response = await fetch(`/api/graphql`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation CancelReservation($id: ID!) {
              cancelReservation(id: $id) {
                _id
              }
            }
          `,
          variables: { id },
        }),
      });

      if (!response.ok) throw new Error('Failed to cancel reservation');

      await fetchReservations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  createEffect(() => {
    if (user()) {
      fetchReservations();
    }
  });

  return (
    <div class="reservations-page">
      <div class="reservations-header">
        <h1>My Reservations</h1>
        <A href="/reservations/create" class="create-btn">
          New Reservation
        </A>
      </div>

      <Show
        when={!loading()}
        fallback={<div class="loading">Loading reservations...</div>}
      >
        <Show
          when={!error()}
          fallback={<div class="error">{error()}</div>}
        >
          <div class="reservations-list">
            <Show
              when={reservations().length > 0}
              fallback={<div class="no-reservations">No reservations found</div>}
            >
              {reservations().map((reservation) => (
                <div class="reservation-card">
                  <div class="reservation-header">
                    <h3>Reservation #{reservation._id}</h3>
                    <span class={`status ${reservation.status.toLowerCase()}`}>
                      {reservation.status}
                    </span>
                  </div>
                  <div class="reservation-details">
                    <p><strong>Date:</strong> {new Date(parseInt(reservation.expectedArrival)).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {new Date(parseInt(reservation.expectedArrival)).toLocaleTimeString()}</p>
                    <p><strong>Table Size:</strong> {reservation.tableSize}</p>
                  </div>
                  <div class="reservation-actions">
                      <Show when={reservation.status === ReservationStatus.requested}>
                      <A
                        href={`/reservations/${reservation._id}/edit`}
                        class="edit-btn"
                      >
                        Edit
                      </A>
                      <button
                        onClick={() => cancelReservation(reservation._id)}
                        class="cancel-btn"
                      >
                        Cancel
                      </button>
                    </Show>
                  </div>
                </div>
              ))}
            </Show>
          </div>
        </Show>
      </Show>
    </div>
  );
};

export default GuestReservations; 