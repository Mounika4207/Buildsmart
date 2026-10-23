import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import FormInput from '../components/forms/FormInput';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPassword = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
      showToast('Password reset link dispatched.', 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to dispatch reset email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', color: '#ffffff', marginBottom: '0.4rem' }}>
          Reset Password
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Enter your registered email address to receive password recovery instructions.
        </p>
      </div>

      {submitted ? (
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'rgba(16, 239, 140, 0.08)',
            border: '1px solid rgba(16, 239, 140, 0.3)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <CheckCircle2 size={40} color="var(--lime-primary)" />
          <h4 style={{ color: '#fff', fontSize: '1.1rem', margin: 0 }}>
            Instructions Sent
          </h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
            If an account exists for <strong style={{ color: '#fff' }}>{email}</strong>, we have sent a secure reset link.
          </p>
          <Link to="/login" className="btn btn-lime btn-sm" style={{ marginTop: '0.5rem' }}>
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <FormInput
            label="Email Address"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            error={error}
            required
          />

          <button
            type="submit"
            className="btn btn-lime btn-lg"
            disabled={submitting}
            style={{ width: '100%', marginTop: '0.5rem', fontWeight: 700 }}
          >
            {submitting ? 'Sending Request...' : 'Send Reset Link'}
          </button>
        </form>
      )}

      <div style={{ textAlign: 'center' }}>
        <Link
          to="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
