import { createSignal, Show } from 'solid-js';
import { A, useNavigate } from '@solidjs/router';
import { useAuth } from '@hooks/useAuth';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [formData, setFormData] = createSignal({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData().password !== formData().confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData();
      await register(registerData.name, registerData.email, registerData.phone, registerData.password);
      navigate('/');
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
    <div class="register-page">
      <div class="register-card">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData().name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData().email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input
              type="tel"
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
              minLength={6}
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData().confirmPassword}
              onChange={handleInputChange}
              required
              minLength={6}
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
            {loading() ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p class="login-link">
          Already have an account? <A href="/login">Login</A>
        </p>
      </div>
    </div>
  );
} 