import { createSignal, createEffect, Show } from 'solid-js';
import { useNavigate, useParams } from '@solidjs/router';
import { Reservation, ReservationStatus } from '../../types/reservation';
import './ReservationDetails.css';

const ReservationDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [reservation, setReservation] = createSignal<Reservation | null>(null);

  const fetchReservation = async () => {
    try {
      const response = await fetch(`/api/reservations/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch reservation');

      const data = await response.json();
      setReservation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (status: ReservationStatus) => {
    try {
      const response = await fetch(`/api/reservations/${params.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update reservation status');

      await fetchReservation();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  createEffect(() => {
    fetchReservation();
  });

  return (
    <div class="reservation-details-page">
      <div class="page-header">
        <h1>Reservation Details</h1>
        <button
          onClick={() => navigate('/employee/dashboard')}
          class="back-btn"
        >
          Back to Dashboard
        </button>
      </div>

      <Show
        when={!loading()}
        fallback={<div class="loading">Loading reservation details...</div>}
      >
        <Show
          when={reservation()}
          fallback={<div class="error">Reservation not found</div>}
        >
          <div class="reservation-details-card">
            <div class="reservation-header">
              <h2>Reservation #{reservation()?.id}</h2>
              <span class={`status ${reservation()?.status.toLowerCase()}`}>
                {reservation()?.status}
              </span>
            </div>

            <div class="details-section">
              <h3>Guest Information</h3>
              <div class="details-grid">
                <div class="detail-item">
                  <label>Name</label>
                  <p>{reservation()?.user.name}</p>
                </div>
                <div class="detail-item">
                  <label>Email</label>
                  <p>{reservation()?.user.email}</p>
                </div>
                <div class="detail-item">
                  <label>Phone</label>
                  <p>{reservation()?.user.phone}</p>
                </div>
              </div>
            </div>

            <div class="details-section">
              <h3>Reservation Information</h3>
              <div class="details-grid">
                <div class="detail-item">
                  <label>Date</label>
                  <p>{new Date(reservation()?.date || '').toLocaleDateString()}</p>
                </div>
                <div class="detail-item">
                  <label>Time</label>
                  <p>{reservation()?.time}</p>
                </div>
                <div class="detail-item">
                  <label>Party Size</label>
                  <p>{reservation()?.partySize} people</p>
                </div>
                {reservation()?.specialRequests && (
                  <div class="detail-item full-width">
                    <label>Special Requests</label>
                    <p>{reservation()?.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>

            <div class="details-section">
              <h3>Actions</h3>
              <div class="status-actions">
                <button
                  onClick={() => updateReservationStatus(ReservationStatus.APPROVED)}
                  class="approve-btn"
                  disabled={reservation()?.status === ReservationStatus.APPROVED}
                >
                  Approve
                </button>
                <button
                  onClick={() => updateReservationStatus(ReservationStatus.CANCELLED)}
                  class="cancel-btn"
                  disabled={reservation()?.status === ReservationStatus.CANCELLED}
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateReservationStatus(ReservationStatus.COMPLETED)}
                  class="complete-btn"
                  disabled={reservation()?.status === ReservationStatus.COMPLETED}
                >
                  Complete
                </button>
              </div>
            </div>

            <Show when={error()}>
              <div class="error">{error()}</div>
            </Show>
          </div>
        </Show>
      </Show>
    </div>
  );
};

export default ReservationDetails; 