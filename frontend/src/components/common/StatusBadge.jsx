import React from 'react';
import { CheckCircle2, Clock, XCircle, ShieldCheck, AlertCircle } from 'lucide-react';
import { getBookingStatusInfo } from '../../utils/formatters';

export const StatusBadge = ({ status, type = 'booking' }) => {
  if (type === 'verified') {
    return status ? (
      <span className="badge badge-verified">
        <ShieldCheck size={12} />
        <span>Verified</span>
      </span>
    ) : null;
  }

  if (type === 'payment') {
    const isPaid = status === 'paid';
    return (
      <span className={`badge ${isPaid ? 'badge-confirmed' : 'badge-pending'}`}>
        {isPaid ? <CheckCircle2 size={12} /> : <Clock size={12} />}
        <span>{isPaid ? 'Paid' : 'Payment Pending'}</span>
      </span>
    );
  }

  const info = getBookingStatusInfo(status);

  return (
    <span className={`badge ${info.badgeClass}`}>
      {status === 'confirmed' && <CheckCircle2 size={12} />}
      {status === 'pending' && <Clock size={12} />}
      {status === 'cancelled' && <XCircle size={12} />}
      {status === 'completed' && <CheckCircle2 size={12} />}
      <span>{info.label}</span>
    </span>
  );
};

export default StatusBadge;
