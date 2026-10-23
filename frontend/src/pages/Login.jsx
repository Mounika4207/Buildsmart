import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import FormInput from '../components/forms/FormInput';
import { LogIn, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Destination after login
  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email format.';
    }
    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const data = await login(formData);
      showToast(data.message || 'Logged in successfully!', 'success');

      // If user is turf owner or admin, send them to their dashboard unless specific target was requested
      if (!location.state?.from) {
        if (data.user?.role === 'owner') {
          navigate('/owner/dashboard', { replace: true });
          return;
        } else if (data.user?.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
          return;
        }
      }

      navigate(from, { replace: true, state: location.state });
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || err.message || 'Invalid credentials or connection error.';
      setServerError(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Quick preset helper for college demo review
  const applyPreset = (presetEmail, presetRole) => {
    setFormData({
      email: presetEmail,
      password: 'password123',
    });
    setErrors({});
    showToast(`Loaded ${presetRole} demo credentials. Click "Sign In" to proceed.`, 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', color: '#ffffff', marginBottom: '0.4rem' }}>
          Welcome Back
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Sign in to access your bookings and sports ground reservations.
        </p>
      </div>

      {serverError && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-sm)',
            color: '#f87171',
            fontSize: '0.85rem',
          }}
        >
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <FormInput
          label="Email Address"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="name@example.com"
          error={errors.email}
          required
        />

        <div>
          <FormInput
            label="Password"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.password}
            required
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.4rem' }}>
            <Link
              to="/forgot-password"
              style={{ fontSize: '0.82rem', color: 'var(--lime-primary)' }}
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-lime btn-lg"
          disabled={submitting}
          style={{ width: '100%', marginTop: '0.5rem', fontWeight: 700 }}
        >
          {submitting ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      {/* College Project Evaluation Helpers (Demo Credentials) */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          College Demo Quick Accounts
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => applyPreset('aditya@example.com', 'Customer')}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem' }}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => applyPreset('rajesh.owner@playarena.example', 'Turf Owner')}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem' }}
          >
            Turf Owner
          </button>
          <button
            type="button"
            onClick={() => applyPreset('admin@playarena.example', 'Admin')}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem' }}
          >
            Admin
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
        Don't have an account yet?{' '}
        <Link to="/register" style={{ color: 'var(--lime-primary)', fontWeight: 600 }}>
          Create an Account
        </Link>
      </div>
    </div>
  );
};

export default Login;
