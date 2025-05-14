import { Show } from 'solid-js';
import { A } from '@solidjs/router';
import { useAuth } from '@hooks/useAuth';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav class={styles.navbar}>
      <div class={styles.brand}>
        <A href="/" class={styles.logo}>
          Restaurant Reservations
        </A>
      </div>
      <div class={styles.menu}>
        <Show
          when={user()}
          fallback={
            <>
              <A href="/login" class={styles.link}>Login</A>
              <A href="/register" class={styles.link}>Register</A>
            </>
          }
        >
          <div class={styles.userInfo}>
            <span class={styles.userName}>Welcome, {user()?.name}</span>
            <span class={styles.userRole}>{user()?.role}</span>
          </div>
          <Show
            when={user()?.role === 'EMPLOYEE'}
            fallback={
              <>
                <A href="/reservations" class={styles.link}>My Reservations</A>
                <A href="/reservations/create" class={styles.link}>New Reservation</A>
              </>
            }
          >
            <A href="/employee/dashboard" class={styles.link}>Dashboard</A>
          </Show>
          <button onClick={logout} class={styles.logoutButton}>
            Logout
          </button>
        </Show>
      </div>
    </nav>
  );
};

export default Navbar; 