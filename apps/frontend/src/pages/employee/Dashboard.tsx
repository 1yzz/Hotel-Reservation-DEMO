import { createSignal, createEffect, Show } from 'solid-js';
import { A } from '@solidjs/router';
import { Reservation, ReservationStatus } from '../../types/reservation';
import './Dashboard.css';

const Dashboard = () => {
  const [reservations, setReservations] = createSignal<Reservation[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [selectedDate, setSelectedDate] = createSignal(new Date().toISOString().split('T')[0]);
  const [selectedStatus, setSelectedStatus] = createSignal<ReservationStatus>(ReservationStatus.requested);

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
              reservations(date: "${selectedDate()}", status: "${selectedStatus()}") {
                id
                status
                expectedArrival
                tableSize
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
      const response = await fetch(`/api/reservations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status }),
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
            <option value="ALL">All Statuses</option>
            <option value={ReservationStatus.requested}>Pending</option>
            <option value={ReservationStatus.approved}>Approved</option>
            <option value={ReservationStatus.cancelled}>Cancelled</option>
            <option value={ReservationStatus.completed}>Completed</option>
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
                    <h3>Reservation #{reservation.id}</h3>
                    <span class={`status ${reservation.status.toLowerCase()}`}>
                      {reservation.status}
                    </span>
                  </div>
                  <div class="reservation-details">
                    <p><strong>Guest:</strong> {reservation?.guest?.name}</p>
                    <p><strong>Phone:</strong> {reservation?.guest?.phone}</p>
                    <p><strong>Date:</strong> {new Date(reservation.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {reservation.time}</p>
                    <p><strong>Party Size:</strong> {reservation.tableSize}</p>
              
                  </div>
                  <div class="reservation-actions">
                    <A
                      href={`/employee/reservations/${reservation.id}`}
                      class="view-btn"
                    >
                      View Details
                    </A>
                    <div class="status-actions">
                      <button
                        onClick={() => updateReservationStatus(reservation.id, ReservationStatus.approved)}
                        class="approve-btn"
                        disabled={reservation.status === ReservationStatus.approved}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateReservationStatus(reservation.id, ReservationStatus.cancelled)}
                        class="cancel-btn"
                        disabled={reservation.status === ReservationStatus.cancelled}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => updateReservationStatus(reservation.id, ReservationStatus.completed)}
                        class="complete-btn"
                        disabled={reservation.status === ReservationStatus.completed}
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