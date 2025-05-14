import { createSignal, createEffect, Show } from 'solid-js';
import { useNavigate, useParams } from '@solidjs/router';
import { Reservation, UpdateReservationInput } from '../../types/reservation';
import './EditReservation.css';

const EditReservation = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [loading, setLoading] = createSignal(true);
  const [saving, setSaving] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [reservation, setReservation] = createSignal<Reservation | null>(null);
  const [formData, setFormData] = createSignal<UpdateReservationInput>({
    date: '',
    time: '',
    tableSize: 2,
  });

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
            query GetReservation($id: ID!) {
              reservation(id: $id) {
                _id
                expectedArrival
                tableSize
              }
            }
          `,
          variables: { id: params.id },
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch reservation');

      const data = await response.json();
      const item = data?.data?.reservation;
      setReservation(item);

      setFormData({
        date: new Date(parseInt(item.expectedArrival)).toISOString().split('T')[0],
        time: new Date(parseInt(item.expectedArrival)).toLocaleTimeString(),
        tableSize: item.tableSize,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          query: `
            mutation UpdateReservation($id: ID!, $input: UpdateReservationInput!) {
              updateReservation(id: $id, input: $input) {
                _id
                expectedArrival
                tableSize
              }
            }
          `,
          variables: { id: params.id, input: {
            expectedArrival: formData().date + 'T' + formData().time,
            tableSize: formData().tableSize,
          }},
        }),
      });

      if (!response.ok) throw new Error('Failed to update reservation');

      navigate('/reservations');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setFormData({
      ...formData(),
      [target.name]: target.type === 'number' ? parseInt(target.value) : target.value,
    });
  };

  createEffect(() => {
    fetchReservation();
  });

  return (
    <div class="edit-reservation-page">
      <h1>Edit Reservation</h1>

      <Show
        when={!loading()}
        fallback={<div class="loading">Loading reservation...</div>}
      >
        <Show
          when={reservation()}
          fallback={<div class="error">Reservation not found</div>}
        >
          <form onSubmit={handleSubmit} class="reservation-form">
            <div class="form-group">
              <label for="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData().date}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div class="form-group">
              <label for="time">Time</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData().time}
                onChange={handleInputChange}
                required
                min="11:00"
                max="22:00"
              />
            </div>

            <div class="form-group">
              <label for="tableSize">Table Size</label>
              <input
                type="number"
                id="tableSize"
                name="tableSize"
                value={formData().tableSize}
                onChange={handleInputChange}
                required
                min="1"
                max="10"
              />
            </div>

          
            <Show when={error()}>
              <div class="error">{error()}</div>
            </Show>

            <div class="form-actions">
              <button
                type="button"
                onClick={() => navigate('/reservations')}
                class="cancel-btn"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving()}
                class="submit-btn"
              >
                {saving() ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Show>
      </Show>
    </div>
  );
};

export default EditReservation; 