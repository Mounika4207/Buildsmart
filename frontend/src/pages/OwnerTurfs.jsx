import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { turfService } from '../services/turfService';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/common/StatusBadge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import {
  Layers,
  PlusCircle,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  Eye,
  IndianRupee,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const OwnerTurfs = () => {
  const { showToast } = useToast();
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [turfToDelete, setTurfToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTurfs = async () => {
    setLoading(true);
    try {
      const res = await turfService.getOwnerTurfs();
      setTurfs(res.turfs || []);
    } catch (err) {
      console.error('Error fetching owner turfs:', err);
      showToast('Failed to load your turfs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurfs();
  }, []);

  const handleDelete = async () => {
    if (!turfToDelete) return;
    setDeleting(true);
    try {
      const id = turfToDelete._id || turfToDelete.id;
      await turfService.deleteTurf(id);
      showToast('Facility listing removed.', 'success');
      setTurfToDelete(null);
      fetchTurfs();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete turf.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#ffffff', margin: 0 }}>
            My Managed Sports Facilities
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            List, update venue amenities, pricing, and check administrative verification status.
          </p>
        </div>

        <Link to="/owner/turfs/new" className="btn btn-lime">
          <PlusCircle size={18} />
          <span>Add New Turf</span>
        </Link>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} height="150px" />
      ) : turfs.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No Venues Listed"
          description="You have not listed any sports facilities yet. Add your cricket pitch, football ground, or court to start taking bookings."
          actionLabel="Add First Facility"
          actionLink="/owner/turfs/new"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {turfs.map((turf) => {
            const id = turf._id || turf.id;
            const img =
              turf.images?.[0] ||
              'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=400&q=80';

            return (
              <div
                key={id}
                className="card"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                  padding: '1.25rem',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flex: '1 1 340px' }}>
                  <img
                    src={img}
                    alt={turf.name}
                    style={{
                      width: '120px',
                      height: '90px',
                      borderRadius: 'var(--radius-sm)',
                      objectFit: 'cover',
                      backgroundColor: '#0c1424',
                    }}
                  />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>
                        {turf.name}
                      </h3>
                      <StatusBadge status={turf.isVerified} type="verified" />
                      {!turf.isVerified && (
                        <span className="badge badge-pending">
                          Verification Pending
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <MapPin size={14} color="var(--lime-primary)" />
                      <span>{turf.address || turf.city}</span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.2rem' }}>
                      {turf.sports?.map((s) => (
                        <span key={s} className="badge badge-sport" style={{ fontSize: '0.72rem' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price and actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
                      Hourly Rate
                    </span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--lime-primary)' }}>
                      {formatCurrency(turf.pricePerHour)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link
                      to={`/turfs/${id}`}
                      className="btn btn-secondary btn-sm"
                      title="Public preview"
                    >
                      <Eye size={15} />
                      <span>View</span>
                    </Link>

                    <Link
                      to={`/owner/turfs/${id}/edit`}
                      className="btn btn-secondary btn-sm"
                      title="Edit venue details"
                    >
                      <Edit2 size={15} />
                      <span>Edit</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setTurfToDelete(turf)}
                      className="btn btn-danger btn-sm"
                      title="Delete listing"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!turfToDelete}
        onClose={() => setTurfToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Sports Facility"
        message={`Are you sure you want to remove "${turfToDelete?.name}"? All upcoming slot records for this turf will be decommissioned.`}
        confirmLabel="Confirm Delete"
        cancelLabel="Keep Facility"
        isDanger={true}
        loading={deleting}
      />
    </div>
  );
};

export default OwnerTurfs;
