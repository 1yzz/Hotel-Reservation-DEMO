import { createSignal, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { CreateReservationInput } from '../../types/reservation';
import './CreateReservation.css';

const CreateReservation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [formData, setFormData] = createSignal<CreateReservationInput>({
    date: '',
    time: '',
    tableSize: 2,
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          query: `
            mutation CreateReservation($input: CreateReservationInput!) {
              createReservation(input: $input) {
                guestId
                expectedArrival
                tableSize
              }
            }
          `,    
          variables: {
            input: {
              guestId: JSON.parse(localStorage.getItem('user') || '{}').id,
              expectedArrival: formData().date + 'T' + formData().time,
              tableSize: formData().tableSize,
            }
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to create reservation');

      navigate('/reservations');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setFormData({
      ...formData(),
      [target.name]: target.type === 'number' ? parseInt(target.value) : target.value,
    });
  };

  return (
    <div class="create-reservation-page">
      <h1>Create New Reservation</h1>

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
            disabled={loading()}
            class="submit-btn"
          >
            {loading() ? 'Creating...' : 'Create Reservation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReservation; 