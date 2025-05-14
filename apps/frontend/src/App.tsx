import { Router, Route } from '@solidjs/router';
import { Suspense, Show } from 'solid-js';
import { useAuth } from '@hooks/useAuth';
import Home from '@pages/Home';
import Login from '@pages/Login';
import Register from '@pages/Register';
import GuestReservations from '@pages/guest/Reservations';
import CreateReservation from '@pages/guest/CreateReservation';
import EditReservation from '@pages/guest/EditReservation';
import EmployeeDashboard from '@pages/employee/Dashboard';
import ReservationDetails from '@pages/employee/ReservationDetails';
import '@styles/App.css';

export default function App() {
  return (
    <div class="app">
    <main class="main-content">
      <Show
      when={true}
        fallback={<div class="loading">Loading...</div>}
      >
        <Suspense fallback={<div class="loading">Loading...</div>}>
        <Router> 
            <Route path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />

            {/* Guest routes */}
            <Route path="/reservations" component={GuestReservations} />
            <Route path="/reservations/create" component={CreateReservation} />
            <Route path="/reservations/:id/edit" component={EditReservation} />

            {/* Employee routes */}
            <Route path="/employee/dashboard" component={EmployeeDashboard} />
            <Route path="/employee/reservations/:id" component={ReservationDetails} />
          </Router>
        </Suspense>
      </Show>
    </main>
  </div>
  );
}
