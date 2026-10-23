import React, { useState, useEffect } from 'react';
import { turfService } from '../services/turfService';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import {
  ShieldCheck,
  ShieldAlert,
  XCircle,
  Eye,
  CheckCircle,
  MapPin,
  Clock,
  IndianRupee,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const AdminTurfs = () => {
  const { showToast } = useToast();
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'verified'

  // Modal preview
  const [previewTurf, setPreviewTurf] = useState(null);

  // Approval / Rejection dialog
  const [actionTarget, setActionTarget] = useState(null); // { turf, type: 'approve' | 'reject' }
  const [processing, setProcessing] = useState(false);

  const fetchTurfs = async () => {
    setLoading(true);
    try {
      const res = await turfService.getAllTurfs();
      setTurfs(res.turfs || []);
    } catch (err) {
      showToast('Failed to load turfs directory.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurfs();
  }, []);

  const handleActionConfirm = async () => {
    if (!actionTarget) return;
    setProcessing(true);
    try {
      const id = actionTarget.turf._id || actionTarget.turf.id;
      const isVerified = actionTarget.type === 'approve';
      await turfService.updateTurfVerification(id, isVerified);
      showToast(
        isVerified ? 'Facility approved and verified successfully!' : 'Facility rejected.',
        'success'
      );
      setActionTarget(null);
      fetchTurfs();
    } catch (err) {
      showToast('Action failed to update turf.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const filtered = turfs.filter((t) => {
    if (activeTab === 'pending') return !t.isVerified;
    if (activeTab === 'verified') return t.isVerified;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', color: '#ffffff', margin: 0 }}>
          Facility Quality & Verification Hub
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
          Inspect ground safety parameters, floodlighting specs, and authorize live marketplace listings.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.5rem',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          style={{
            padding: '0.6rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            fontSize: '0.88rem',
            backgroundColor: activeTab === 'all' ? 'rgba(16, 239, 140, 0.12)' : 'transparent',
            color: activeTab === 'all' ? 'var(--lime-primary)' : 'var(--text-secondary)',
          }}
        >
          All Facilities ({turfs.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '0.6rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            fontSize: '0.88rem',
            backgroundColor: activeTab === 'pending' ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
            color: activeTab === 'pending' ? '#fbbf24' : 'var(--text-secondary)',
          }}
        >
          Pending Review ({turfs.filter((t) => !t.isVerified).length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('verified')}
          style={{
            padding: '0.6rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            fontSize: '0.88rem',
            backgroundColor: activeTab === 'verified' ? 'rgba(16, 239, 140, 0.12)' : 'transparent',
            color: activeTab === 'verified' ? 'var(--lime-primary)' : 'var(--text-secondary)',
          }}
        >
          Verified Active ({turfs.filter((t) => t.isVerified).length})
        </button>
      </div>

      {/* Turfs List */}
      {loading ? (
        <LoadingSkeleton count={3} height="90px" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No Facilities Found"
          description={`There are currently no venues in the "${activeTab}" section.`}
        />
      ) : (
        <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Venue</th>
                <th style={{ padding: '0.75rem 1rem' }}>Location</th>
                <th style={{ padding: '0.75rem 1rem' }}>Rate / hr</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((turf) => {
                const id = turf._id || turf.id;
                return (
                  <tr key={id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{turf.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Sports: {turf.sports?.join(', ')}
                      </div>
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {turf.area ? `${turf.area}, ` : ''}{turf.city}
                    </td>

                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--lime-primary)' }}>
                      {formatCurrency(turf.pricePerHour)}
                    </td>

                    <td style={{ padding: '1rem' }}>
                      {turf.isVerified ? (
                        <span className="badge badge-verified">
                          Verified
                        </span>
                      ) : (
                        <span className="badge badge-pending">
                          Pending Audit
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => setPreviewTurf(turf)}
                          className="btn btn-secondary btn-sm"
                          title="Preview full details"
                        >
                          <Eye size={15} />
                          <span>Audit</span>
                        </button>

                        {!turf.isVerified ? (
                          <button
                            type="button"
                            onClick={() => setActionTarget({ turf, type: 'approve' })}
                            className="btn btn-lime btn-sm"
                            title="Approve for public booking"
                          >
                            <CheckCircle size={15} />
                            <span>Approve</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActionTarget({ turf, type: 'reject' })}
                            className="btn btn-danger btn-sm"
                            title="Revoke verification"
                          >
                            <XCircle size={15} />
                            <span>Revoke</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Audit Preview Modal */}
      <Modal
        isOpen={!!previewTurf}
        onClose={() => setPreviewTurf(null)}
        title="Admin Facility Inspection"
        maxWidth="620px"
      >
        {previewTurf && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <img
              src={previewTurf.images?.[0] || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80'}
              alt={previewTurf.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
            />

            <div>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', margin: 0 }}>{previewTurf.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                <MapPin size={14} color="var(--lime-primary)" />
                <span>{previewTurf.address || `${previewTurf.area}, ${previewTurf.city}`}</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
              {previewTurf.description || 'No description provided.'}
            </p>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                Declared Facilities
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {previewTurf.facilities?.map((f) => (
                  <span key={f} className="badge badge-sport" style={{ fontSize: '0.75rem' }}>
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <button type="button" onClick={() => setPreviewTurf(null)} className="btn btn-secondary">
                Close
              </button>
              {!previewTurf.isVerified && (
                <button
                  type="button"
                  onClick={() => {
                    const t = previewTurf;
                    setPreviewTurf(null);
                    setActionTarget({ turf: t, type: 'approve' });
                  }}
                  className="btn btn-lime"
                >
                  Approve Facility
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!actionTarget}
        onClose={() => setActionTarget(null)}
        onConfirm={handleActionConfirm}
        title={actionTarget?.type === 'approve' ? 'Approve Sports Arena' : 'Revoke Verification'}
        message={
          actionTarget?.type === 'approve'
            ? `Grant verification badge to "${actionTarget?.turf?.name}"? It will become featured and publicly open for player bookings.`
            : `Revoke verified status for "${actionTarget?.turf?.name}"?`
        }
        confirmLabel={actionTarget?.type === 'approve' ? 'Confirm Approval' : 'Revoke Status'}
        cancelLabel="Cancel"
        isDanger={actionTarget?.type === 'reject'}
        loading={processing}
      />
    </div>
  );
};

export default AdminTurfs;
