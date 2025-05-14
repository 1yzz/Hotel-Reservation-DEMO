import { A } from '@solidjs/router';
import { Show } from 'solid-js';
import { useAuth } from '@hooks/useAuth';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div class="home-page">
      <div class="hero">
        <h1>Welcome to Restaurant Reservations</h1>
        <p>Book your table with ease and enjoy a great dining experience</p>
        <div class="cta-buttons">
          <Show
            when={user()}
            fallback={
              <>
                <A href="/login" class="btn primary">Login</A>
                <A href="/register" class="btn secondary">Register</A>
              </>
            }
          >
            <A href="/reservations" class="btn primary">View My Reservations</A>
            <A href="/reservations/create" class="btn secondary">Make a Reservation</A>
          </Show>
        </div>
      </div>

      <div class="features">
        <div class="feature">
          <h3>Easy Booking</h3>
          <p>Make reservations in just a few clicks</p>
        </div>
        <div class="feature">
          <h3>Manage Reservations</h3>
          <p>View, edit, or cancel your bookings anytime</p>
        </div>
        <div class="feature">
          <h3>Special Requests</h3>
          <p>Let us know about any special requirements</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 