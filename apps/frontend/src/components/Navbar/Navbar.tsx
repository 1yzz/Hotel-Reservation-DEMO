import { Show, createSignal } from 'solid-js';
import { A } from '@solidjs/router';
import { useAuth } from '@hooks/useAuth';
import { UserRole } from '../../types/user';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen());
  };

  return (
    <nav class={styles.navbar}>     
      <div class={styles.navbarContent}>
        <div class={styles.brand}>
          <A href="/" class={styles.logo}>
            Restaurant Reservations
          </A>
        </div>

        <button 
          class={styles.menuButton} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span class={styles.menuIcon}></span>
        </button>

        <div class={`${styles.menu} ${isMenuOpen() ? styles.menuOpen : ''}`}>
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
            </div>
            <Show
              when={user()?.role === UserRole.EMPLOYEE}
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
      </div>
    </nav>
  );
};

export default Navbar; 