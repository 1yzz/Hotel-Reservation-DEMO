import { Component, createSignal, Show } from 'solid-js';
import { A, useNavigate } from '@solidjs/router';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/user';
import styles from './Navbar.module.css';

const Navbar: Component = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen());
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav class={styles.navbar}>
      <div class={styles.logo}>
        <A href="/home">H-Reservation</A>
      </div>

      <button 
        class={styles.menuButton} 
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <div class={`${styles.menuIcon} ${isMenuOpen() ? styles.menuOpen : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      <div class={`${styles.menu} ${isMenuOpen() ? styles.menuOpen : ''}`}>
        <Show when={user()}>
          <div class={styles.userInfo}>
            <span>Welcome, {user()?.name}!</span>
          </div>

          <Show when={user()?.role === UserRole.EMPLOYEE}>
            <A href="/employee/dashboard" class={styles.link}>Dashboard</A>
            <A href="/employee/charts" class={styles.link}>Charts</A>
          </Show>

          <Show when={user()?.role === UserRole.GUEST}>
            <A href="/reservations" class={styles.link}>My Reservations</A>
            <A href="/reservations/create" class={styles.link}>New Reservation</A>
          </Show>

          <button onClick={handleLogout} class={styles.logoutButton}>
            Logout
          </button>
        </Show>

        <Show when={!user()}>
          <A href="/login" class={styles.link}>Login</A>
          <A href="/register" class={styles.link}>Register</A>
        </Show>
      </div>
    </nav>
  );
};

export default Navbar; 