import { createSignal, createEffect, Show } from 'solid-js';
import { A } from '@solidjs/router';
import { Reservation, ReservationStatus } from '../../types/reservation';
import './Dashboard.css';

const Dashboard = () => {
  const [reservations, setReservations] = createSignal<Reservation[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [selectedDate, setSelectedDate] = createSignal(new Date().toISOString().split('T')[0]);
  const [selectedStatus, setSelectedStatus] = createSignal<ReservationStatus | 'ALL'>('ALL');

  const fetchReservations = async () => {
    try {
      const queryParams = new URLSearchParams({
        date: selectedDate(),
        ...(selectedStatus() !== 'ALL' && { status: selectedStatus() }),
      });

      const response = await fetch(`/api/reservations?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch reservations');

      const data = await response.json();
      setReservations(data);
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
            onChange={(e) => setSelectedStatus(e.target.value as ReservationStatus | 'ALL')}
          >
            <option value="ALL">All Statuses</option>
            <option value={ReservationStatus.PENDING}>Pending</option>
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
                    <h3>Reservation #{reservation.id}</h3>
                    <span class={`status ${reservation.status.toLowerCase()}`}>
                      {reservation.status}
                    </span>
                  </div>
                  <div class="reservation-details">
                    <p><strong>Guest:</strong> {reservation.user.name}</p>
                    <p><strong>Email:</strong> {reservation.user.email}</p>
                    <p><strong>Phone:</strong> {reservation.user.phone}</p>
                    <p><strong>Date:</strong> {new Date(reservation.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {reservation.time}</p>
                    <p><strong>Party Size:</strong> {reservation.partySize}</p>
                    {reservation.specialRequests && (
                      <p><strong>Special Requests:</strong> {reservation.specialRequests}</p>
                    )}
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
                        onClick={() => updateReservationStatus(reservation.id, ReservationStatus.APPROVED)}
                        class="approve-btn"
                        disabled={reservation.status === ReservationStatus.APPROVED}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateReservationStatus(reservation.id, ReservationStatus.CANCELLED)}
                        class="cancel-btn"
                        disabled={reservation.status === ReservationStatus.CANCELLED}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => updateReservationStatus(reservation.id, ReservationStatus.COMPLETED)}
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