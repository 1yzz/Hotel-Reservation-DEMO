import { createSignal, Show } from 'solid-js';
import { A, useNavigate } from '@solidjs/router';
import { useAuth } from '@hooks/useAuth';
import './Login.css';
import { UserRole } from '@/types/user';
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [formData, setFormData] = createSignal({
    phone: '',
    password: '',
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await login(formData().phone, formData().password);
      
      // TODO: redirect to employee dashboard if user is employee
      if (user.role === UserRole.EMPLOYEE) {
        navigate('/employee/dashboard');
      } else {
        navigate('/');
      }

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
      [target.name]: target.value,
    });
  };

  return (
    <div class="login-page">
      <div class="login-card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div class="form-group">
            <label for="phone">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData().phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData().password}
              onChange={handleInputChange}
              required
            />
          </div>

          <Show when={error()}>
            <div class="error">{error()}</div>
          </Show>

          <button
            type="submit"
            class="submit-btn"
            disabled={loading()}
          >
            {loading() ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p class="register-link">
          Don't have an account? <A href="/register">Register</A>
        </p>
      </div>
    </div>
  );
};

export default Login; 