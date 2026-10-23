import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import FormInput from '../components/forms/FormInput';
import { UserCheck, Building2 } from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer', // 'customer' or 'owner' (Admin prohibited)
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Valid email is required.';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^[0-9+\s-]{10,15}$/.test(formData.phone)) {
      errs.phone = 'Please provide a valid 10-digit mobile number.';
    }
    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    if (!formData.agreeTerms) {
      errs.agreeTerms = 'You must accept the terms and privacy policy.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
      const data = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role, // only 'customer' or 'owner'
      });

      showToast(data.message || 'Registration successful! Welcome to PlayArena.', 'success');

      if (formData.role === 'owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err.response?.data?.message || err.message || 'Registration failed. Try again.';
      setServerError(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', color: '#ffffff', marginBottom: '0.4rem' }}>
          Create an Account
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Join PlayArena to reserve venues or manage your sports facility.
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        {/* Role Selector Tabs (Customer vs Turf Owner) */}
        <div>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
            Account Role
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, role: 'customer' }))}
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                backgroundColor: formData.role === 'customer' ? 'var(--lime-primary)' : 'rgba(255, 255, 255, 0.04)',
                color: formData.role === 'customer' ? 'var(--lime-text)' : 'var(--text-primary)',
                border: formData.role === 'customer' ? '1px solid var(--lime-primary)' : '1px solid var(--border-subtle)',
              }}
            >
              <UserCheck size={16} />
              <span>Player / Customer</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, role: 'owner' }))}
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                backgroundColor: formData.role === 'owner' ? 'var(--lime-primary)' : 'rgba(255, 255, 255, 0.04)',
                color: formData.role === 'owner' ? 'var(--lime-text)' : 'var(--text-primary)',
                border: formData.role === 'owner' ? '1px solid var(--lime-primary)' : '1px solid var(--border-subtle)',
              }}
            >
              <Building2 size={16} />
              <span>Turf Owner</span>
            </button>
          </div>
        </div>

        <FormInput
          label="Full Name"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Aditya Sen"
          error={errors.name}
          required
        />

        <FormInput
          label="Email Address"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="aditya@example.com"
          error={errors.email}
          required
        />

        <FormInput
          label="Phone Number"
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+91 99887 76655"
          error={errors.phone}
          required
        />

        <FormInput
          label="Password"
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="At least 6 characters"
          error={errors.password}
          required
        />

        <FormInput
          label="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter password"
          error={errors.confirmPassword}
          required
        />

        {/* Terms acceptance */}
        <div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              style={{ marginTop: '3px' }}
            />
            <span>
              I accept the <a href="#terms" style={{ color: 'var(--lime-primary)' }}>Terms of Service</a> and confirm accurate facility or booking information.
            </span>
          </label>
          {errors.agreeTerms && (
            <div style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.35rem' }}>
              {errors.agreeTerms}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-lime btn-lg"
          disabled={submitting}
          style={{ width: '100%', marginTop: '0.5rem', fontWeight: 700 }}
        >
          {submitting ? 'Creating Account...' : 'Complete Registration'}
        </button>
      </form>

      <div style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--lime-primary)', fontWeight: 600 }}>
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
