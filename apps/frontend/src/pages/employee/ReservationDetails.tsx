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
      const response = await fetch(`/api/graphql`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              reservation(id: "${params.id}") {
                _id
                guest {
                  _id
                  name
                  email
                  phone
                }
                expectedArrival
                tableSize
                status
              }
            }
          `
        })
      });

      if (!response.ok) throw new Error('Failed to fetch reservation');

      const data = await response.json();
      setReservation(data.data.reservation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (status: ReservationStatus) => {
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
              updateReservation(id: "${params.id}", input: { status: "${status}" }) {
                _id
                status
              }
            }
          `
        })
      });XSXS

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
              <h2>Reservation #{reservation()?._id}</h2>
              <span class={`status ${reservation()?.status.toLowerCase()}`}>
                {reservation()?.status}
              </span>
            </div>

            <div class="details-section">
              <h3>Guest Information</h3>
              <div class="details-grid">
                <div class="detail-item">
                  <label>Name</label>
                  <p>{reservation()?.guest.name}</p>
                </div>
                <div class="detail-item">
                  <label>Email</label>
                  <p>{reservation()?.guest.email}</p>
                </div>
                <div class="detail-item">
                  <label>Phone</label>
                  <p>{reservation()?.guest.phone}</p>
                </div>
              </div>
            </div>

            <div class="details-section">
              <h3>Reservation Information</h3>
              <div class="details-grid">
                <div class="detail-item">
                  <label>Date</label>
                  <p>{new Date(parseInt(reservation()?.expectedArrival || '')).toLocaleDateString()}</p>
                </div>
                <div class="detail-item">
                  <label>Time</label>
                  <p>{new Date(parseInt(reservation()?.expectedArrival || '')).toLocaleTimeString()}</p>
                </div>
                <div class="detail-item">
                  <label>Table Size</label>
                  <p>{reservation()?.tableSize} people</p>
                </div>
               
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