// Utility formatting helpers for currency, date, time, and status

/**
 * Format an amount in Indian Rupees (₹)
 * @param {number|string} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  const numericAmount = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

/**
 * Format ISO date string into readable date (e.g., "Friday, Oct 24, 2026")
 * @param {string|Date} dateString
 * @param {boolean} short
 * @returns {string}
 */
export const formatDate = (dateString, short = false) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return String(dateString);

  if (short) {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format a 24-hr time or time range (e.g. "18:00" -> "06:00 PM")
 * @param {string} timeStr
 * @returns {string}
 */
export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  // Check if it's already in 12hr format
  if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) {
    return timeStr;
  }
  const parts = timeStr.split(':');
  if (parts.length >= 2) {
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // hour '0' should be '12'
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    return `${formattedHours}:${minutes} ${ampm}`;
  }
  return timeStr;
};

/**
 * Format duration in minutes or hours
 * @param {number} hours
 * @returns {string}
 */
export const formatDuration = (hours) => {
  if (!hours) return '1 hour';
  if (hours === 1) return '1 hour';
  return `${hours} hours`;
};

/**
 * Get readable status and CSS class for a booking
 * @param {string} status
 * @returns {{ label: string, badgeClass: string }}
 */
export const getBookingStatusInfo = (status) => {
  const s = (status || '').toLowerCase();
  switch (s) {
    case 'confirmed':
      return { label: 'Confirmed', badgeClass: 'badge-confirmed' };
    case 'pending':
      return { label: 'Pending', badgeClass: 'badge-pending' };
    case 'cancelled':
      return { label: 'Cancelled', badgeClass: 'badge-cancelled' };
    case 'completed':
      return { label: 'Completed', badgeClass: 'badge-confirmed' };
    case 'blocked':
      return { label: 'Blocked', badgeClass: 'badge-blocked' };
    default:
      return { label: status || 'Unknown', badgeClass: 'badge-secondary' };
  }
};
