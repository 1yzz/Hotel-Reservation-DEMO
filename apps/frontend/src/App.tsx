import { Router, Route, RouteSectionProps, Navigate } from '@solidjs/router';
import { Suspense, Show } from 'solid-js';
import Navbar from './components/Navbar/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import GuestReservations from './pages/guest/Reservations';
import CreateReservation from './pages/guest/CreateReservation';
import Dashboard from './pages/employee/Dashboard';
import '@styles/App.css';
import ReservationDetails from './pages/employee/ReservationDetails';
import Home from './pages/Home';
import Charts from './pages/employee/Charts';

const Layout = (props: RouteSectionProps) => (
  <div class="app">
    <Navbar />
    <main class="main-content">
      {props.children}
    </main>
  </div>
);

const App = () => {
  return (
    <Router>
      <Route path="/" component={Layout}>
        <Route path="/home" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/reservations" component={GuestReservations} />
        <Route path="/reservations/create" component={CreateReservation} />
        <Route path="/employee/dashboard" component={Dashboard} />
        <Route path="/employee/charts" component={Charts} />
        <Route path="/employee/reservations/:id" component={ReservationDetails} />
        <Route path="*" component={() => <Navigate href="/home" />} />
      </Route>
    </Router>
  );
};

export default App;
