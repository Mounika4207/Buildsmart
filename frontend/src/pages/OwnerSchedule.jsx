import React, { useState, useEffect } from 'react';
import { turfService } from '../services/turfService';
import { useToast } from '../context/ToastContext';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { Clock, Calendar, Lock, Unlock, AlertCircle } from 'lucide-react';
import { formatTime, formatDate } from '../utils/formatters';

export const OwnerSchedule = () => {
  const { showToast } = useToast();
  const [turfs, setTurfs] = useState([]);
  const [selectedTurfId, setSelectedTurfId] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load facilities owned
  useEffect(() => {
    turfService.getOwnerTurfs().then((res) => {
      const list = res.turfs || [];
      setTurfs(list);
      if (list.length > 0) {
        setSelectedTurfId(list[0]._id || list[0].id);
      }
    }).catch(() => {});
  }, []);

  // Fetch slot status for selected turf & date
  useEffect(() => {
    if (!selectedTurfId || !selectedDate) return;

    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const res = await turfService.getTurfAvailability(selectedTurfId, selectedDate);
        setSlots(res.slots || []);
      } catch (err) {
        showToast('Failed to load turf schedule.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [selectedTurfId, selectedDate, showToast]);

  const toggleBlockSlot = (slot) => {
    // If booked by customer, cannot block
    if (!slot.isAvailable && slot.reason === 'Booked') {
      showToast('This slot is already booked by a customer and cannot be manually blocked.', 'error');
      return;
    }

    setSlots((prev) =>
      prev.map((s) => {
        if (s.startTime === slot.startTime) {
          const nowBlocked = s.isAvailable;
          return {
            ...s,
            isAvailable: !nowBlocked,
            reason: nowBlocked ? 'Blocked by Facility' : undefined,
          };
        }
        return s;
      })
    );

    showToast(`Slot ${formatTime(slot.startTime)} status updated.`, 'info');
  };

  const selectedTurf = turfs.find((t) => (t._id || t.id) === selectedTurfId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', color: '#ffffff', margin: 0 }}>
          Slot Availability & Schedule Manager
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
          Inspect hourly occupancy or block time slots for ground turf maintenance and private coaching.
        </p>
      </div>

      {/* Control bar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          alignItems: 'end',
        }}
      >
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
            Select Facility
          </label>
          <select
            value={selectedTurfId}
            onChange={(e) => setSelectedTurfId(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 0.85rem' }}
          >
            {turfs.map((t) => (
              <option key={t._id || t.id} value={t._id || t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
            Schedule Date
          </label>
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 0.85rem' }}
          />
        </div>
      </div>

      {/* Slots Matrix */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>
              {selectedTurf?.name || 'Selected Arena'}
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--lime-primary)' }}>
              Operating on {formatDate(selectedDate)}
            </span>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(16, 239, 140, 0.2)', border: '1px solid var(--lime-primary)' }} />
              <span>Open for Booking</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(239, 68, 68, 0.3)', border: '1px solid #ef4444' }} />
              <span>Customer Reserved</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(100, 116, 139, 0.4)', border: '1px solid #94a3b8' }} />
              <span>Owner Blocked / Maintenance</span>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton count={3} height="80px" />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {slots.map((slot) => {
              const isCustomerBooked = !slot.isAvailable && slot.reason === 'Booked';
              const isBlocked = !slot.isAvailable && slot.reason !== 'Booked';
              const isAvailable = slot.isAvailable;

              let cardBg = 'rgba(16, 239, 140, 0.05)';
              let border = '1px solid rgba(16, 239, 140, 0.2)';
              let badgeText = 'Available';
              let badgeClass = 'badge-confirmed';

              if (isCustomerBooked) {
                cardBg = 'rgba(239, 68, 68, 0.06)';
                border = '1px solid rgba(239, 68, 68, 0.3)';
                badgeText = 'Customer Booked';
                badgeClass = 'badge-cancelled';
              } else if (isBlocked) {
                cardBg = 'rgba(100, 116, 139, 0.1)';
                border = '1px solid rgba(148, 163, 184, 0.3)';
                badgeText = slot.reason || 'Blocked';
                badgeClass = 'badge-blocked';
              }

              return (
                <div
                  key={slot.startTime}
                  style={{
                    padding: '1.2rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: cardBg,
                    border,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
                      {formatTime(slot.startTime)}
                    </div>
                    <span className={`badge ${badgeClass}`} style={{ fontSize: '0.7rem' }}>
                      {badgeText}
                    </span>
                  </div>

                  {!isCustomerBooked && (
                    <button
                      type="button"
                      onClick={() => toggleBlockSlot(slot)}
                      className={`btn btn-sm ${isBlocked ? 'btn-secondary' : 'btn-danger'}`}
                      style={{ width: '100%', gap: '0.4rem', fontSize: '0.78rem' }}
                    >
                      {isBlocked ? <Unlock size={14} /> : <Lock size={14} />}
                      <span>{isBlocked ? 'Unblock Slot' : 'Block Slot'}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerSchedule;
