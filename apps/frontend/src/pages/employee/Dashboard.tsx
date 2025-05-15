import { createSignal, createEffect, Show } from 'solid-js';
import { A } from '@solidjs/router';
import { Reservation, ReservationStatus } from '../../types/reservation';
import './Dashboard.css';

const Dashboard = () => {
  const [reservations, setReservations] = createSignal<Reservation[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [selectedDate, setSelectedDate] = createSignal(new Date().toISOString().split('T')[0]);
  const [selectedStatus, setSelectedStatus] = createSignal<ReservationStatus>(ReservationStatus.REQUESTED);

  const fetchReservations = async () => {

    try {
      const response = await fetch(`/api/graphql`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              reservations(date: "${selectedDate()}" status: "${selectedStatus()}") {
                _id
                status
                expectedArrival
                tableSize
                guest {
                  _id
                  name
                  phone
                }
              } 
            }
          `,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch reservations');

      const data = await response.json();

      setReservations(data.data.reservations);
    } catch (err) {

      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (id: string, status: ReservationStatus) => {
    try {
      const response = await fetch(`/api/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          query: `
            mutation {
              updateReservation(id: "${id}", input: { status: "${status}" }) {
                _id
                status
              }
            }
          `
        })
      });

      if (!response.ok) throw new Error('Failed to update reservation status');

      await fetchReservations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  createEffect(() => {
    fetchReservations();
  });

  return (
    <div class="dashboard-page">
      <h1>Reservation Dashboard</h1>

      <div class="filters">
        <div class="filter-group">
          <label for="date">Date</label>
          <input
            type="date"
            id="date"
            value={selectedDate()}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div class="filter-group">
          <label for="status">Status</label>
          <select
            id="status"
            value={selectedStatus()}
            onChange={(e) => setSelectedStatus(e.target.value as ReservationStatus)}
          >
            <option value={ReservationStatus.REQUESTED }>Requested</option>
            <option value={ReservationStatus.APPROVED}>Approved</option>
            <option value={ReservationStatus.CANCELLED}>Cancelled</option>
            <option value={ReservationStatus.COMPLETED}>Completed</option>
          </select>
        </div>
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
                    <p><strong>Guest:</strong> {reservation?.guest?.name}</p>
                    <p><strong>Phone:</strong> {reservation?.guest?.phone}</p>
                    <p><strong>Date:</strong> {new Date(parseInt(reservation.expectedArrival)).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {new Date(parseInt(reservation.expectedArrival)).toLocaleTimeString()}</p>
                    <p><strong>Table Size:</strong> {reservation.tableSize}</p>
              
                  </div>
                  <div class="reservation-actions">
                    <A
                      href={`/employee/reservations/${reservation._id}`}
                      class="view-btn"
                    >
                      View Details
                    </A>
                    <div class="status-actions">
                      <button
                        onClick={() => updateReservationStatus(reservation._id, ReservationStatus.APPROVED)}
                        class="approve-btn"
                        disabled={reservation.status === ReservationStatus.APPROVED}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateReservationStatus(reservation._id, ReservationStatus.CANCELLED)}
                        class="cancel-btn"
                        disabled={reservation.status === ReservationStatus.CANCELLED}
                      >
                        Cancel
                      </button>
                      <button
                          onClick={() => updateReservationStatus(reservation._id, ReservationStatus.COMPLETED)}
                        class="complete-btn"
                        disabled={reservation.status === ReservationStatus.COMPLETED}
                      >
                        Complete
                      </button>
                    </div>
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

export default Dashboard; 