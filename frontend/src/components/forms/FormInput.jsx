import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const FormInput = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  options = [], // for select type
  rows = 3, // for textarea
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
      {label && (
        <label
          htmlFor={id || name}
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          {label}
          {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', width: '100%' }}>
        {type === 'select' ? (
          <select
            id={id || name}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderColor: error ? '#ef4444' : undefined,
              appearance: 'none',
              cursor: 'pointer',
            }}
            aria-invalid={!!error}
            {...rest}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ background: '#111a2e', color: '#fff' }}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            id={id || name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderColor: error ? '#ef4444' : undefined,
              resize: 'vertical',
            }}
            aria-invalid={!!error}
            {...rest}
          />
        ) : (
          <input
            id={id || name}
            name={name}
            type={effectiveType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            style={{
              width: '100%',
              padding: isPassword ? '0.75rem 2.75rem 0.75rem 1rem' : '0.75rem 1rem',
              borderColor: error ? '#ef4444' : undefined,
            }}
            aria-invalid={!!error}
            {...rest}
          />
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error ? (
        <span style={{ fontSize: '0.8rem', color: '#f87171', fontWeight: 500 }}>
          {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
};

export default FormInput;
