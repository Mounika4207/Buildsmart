import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { turfService } from '../services/turfService';
import { useToast } from '../context/ToastContext';
import FormInput from '../components/forms/FormInput';
import { ArrowLeft, Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const AVAILABLE_SPORTS = [
  'cricket',
  'football',
  'badminton',
  'tennis',
  'basketball',
  'pickleball',
];

const AVAILABLE_FACILITIES = [
  'Floodlights',
  'Parking',
  'Locker Room',
  'Drinking Water',
  'Cafeteria',
  'Equipment Rental',
  'Air Conditioning',
  'Showers',
  'Viewing Gallery',
  'First Aid On-site',
];

export const AddEditTurf = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    sports: ['football'],
    city: 'Bengaluru',
    area: '',
    address: '',
    pricePerHour: '',
    description: '',
    facilities: ['Floodlights', 'Parking', 'Drinking Water'],
    openTime: '06:00',
    closeTime: '23:00',
    imageUrl: '',
    cancellationPolicy: 'Free cancellation up to 4 hours before the match slot.',
  });

  const [imagesList, setImagesList] = useState([
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    const fetchExisting = async () => {
      setLoading(true);
      try {
        const res = await turfService.getTurfById(id);
        if (res.turf) {
          const t = res.turf;
          setFormData({
            name: t.name || '',
            sports: t.sports || ['football'],
            city: t.city || 'Bengaluru',
            area: t.area || '',
            address: t.address || '',
            pricePerHour: t.pricePerHour || '',
            description: t.description || '',
            facilities: t.facilities || [],
            openTime: t.openingHours?.open || '06:00',
            closeTime: t.openingHours?.close || '23:00',
            cancellationPolicy: t.cancellationPolicy || '',
          });
          if (t.images && t.images.length > 0) {
            setImagesList(t.images);
          }
        }
      } catch (err) {
        showToast('Failed to load turf details.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchExisting();
  }, [id, isEdit, showToast]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Turf / Arena name is required.';
    if (!formData.address.trim()) errs.address = 'Full address is required.';
    if (!formData.pricePerHour || Number(formData.pricePerHour) <= 0) {
      errs.pricePerHour = 'Please specify a valid hourly price in INR.';
    }
    if (formData.sports.length === 0) {
      errs.sports = 'Select at least one sport supported by this venue.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSportToggle = (sport) => {
    setFormData((prev) => {
      const exists = prev.sports.includes(sport);
      const next = exists ? prev.sports.filter((s) => s !== sport) : [...prev.sports, sport];
      return { ...prev, sports: next };
    });
  };

  const handleFacilityToggle = (fac) => {
    setFormData((prev) => {
      const exists = prev.facilities.includes(fac);
      const next = exists ? prev.facilities.filter((f) => f !== fac) : [...prev.facilities, fac];
      return { ...prev, facilities: next };
    });
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImagesList((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index) => {
    setImagesList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        sports: formData.sports,
        city: formData.city,
        area: formData.area,
        address: formData.address,
        pricePerHour: Number(formData.pricePerHour),
        description: formData.description,
        facilities: formData.facilities,
        openingHours: {
          open: formData.openTime,
          close: formData.closeTime,
        },
        images: imagesList.length > 0 ? imagesList : [
          'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
        ],
        cancellationPolicy: formData.cancellationPolicy,
      };

      if (isEdit) {
        await turfService.updateTurf(id, payload);
        showToast('Facility details updated successfully.', 'success');
      } else {
        await turfService.createTurf(payload);
        showToast('New sports arena submitted! Awaiting admin review.', 'success');
      }

      navigate('/owner/turfs');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save turf.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '840px' }}>
      <div>
        <Link
          to="/owner/turfs"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            marginBottom: '0.75rem',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Facility List</span>
        </Link>
        <h1 style={{ fontSize: '2rem', color: '#ffffff', margin: 0 }}>
          {isEdit ? 'Edit Sports Facility' : 'List a New Sports Arena'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
          Provide accurate details about turf specifications, amenities, and pricing.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Basic Details */}
        <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0, borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            Basic Information
          </h3>

          <FormInput
            label="Arena / Turf Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Apex Thunder Football & Cricket Arena"
            error={errors.name}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormInput
              label="City"
              name="city"
              type="select"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              options={[
                { value: 'Bengaluru', label: 'Bengaluru' },
                { value: 'Mumbai', label: 'Mumbai' },
                { value: 'Delhi NCR', label: 'Delhi NCR' },
                { value: 'Hyderabad', label: 'Hyderabad' },
                { value: 'Chennai', label: 'Chennai' },
                { value: 'Pune', label: 'Pune' },
              ]}
            />

            <FormInput
              label="Locality / Area"
              name="area"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              placeholder="e.g. Koramangala 4th Block"
            />
          </div>

          <FormInput
            label="Complete Physical Address"
            name="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Plot number, Street name, Landmark, Pincode"
            error={errors.address}
            required
          />

          <FormInput
            label="Hourly Pricing (INR ₹)"
            name="pricePerHour"
            type="number"
            value={formData.pricePerHour}
            onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
            placeholder="e.g. 1200"
            error={errors.pricePerHour}
            required
          />

          <FormInput
            label="Description & Surface Specifications"
            name="description"
            type="textarea"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detail the turf material (e.g. FIFA-grade 50mm grass, BWF wooden court), ceiling clearance, dimensions, etc."
          />
        </div>

        {/* Supported Sports */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.75rem' }}>
            Supported Sports Disciplines <span style={{ color: '#ef4444' }}>*</span>
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
            {AVAILABLE_SPORTS.map((sport) => {
              const selected = formData.sports.includes(sport);
              return (
                <button
                  key={sport}
                  type="button"
                  onClick={() => handleSportToggle(sport)}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    backgroundColor: selected ? 'var(--lime-primary)' : 'rgba(255, 255, 255, 0.05)',
                    color: selected ? 'var(--lime-text)' : 'var(--text-primary)',
                    border: selected ? '1px solid var(--lime-primary)' : '1px solid var(--border-subtle)',
                    textTransform: 'capitalize',
                  }}
                >
                  {selected ? '✓ ' : '+ '}
                  {sport}
                </button>
              );
            })}
          </div>
          {errors.sports && (
            <div style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              {errors.sports}
            </div>
          )}
        </div>

        {/* Facilities & Amenities */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.75rem' }}>
            Amenities & Features
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.65rem' }}>
            {AVAILABLE_FACILITIES.map((fac) => {
              const selected = formData.facilities.includes(fac);
              return (
                <label
                  key={fac}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.88rem',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: selected ? 'rgba(16, 239, 140, 0.08)' : 'transparent',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => handleFacilityToggle(fac)}
                  />
                  <span>{fac}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Operating Hours */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            Daily Operating Hours
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormInput
              label="Opening Time"
              name="openTime"
              type="time"
              value={formData.openTime}
              onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
            />
            <FormInput
              label="Closing Time"
              name="closeTime"
              type="time"
              value={formData.closeTime}
              onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
            />
          </div>
        </div>

        {/* Photo URLs */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.75rem' }}>
            Facility Photo Gallery
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Provide high-resolution image URLs showcasing your artificial turf, lighting, or court lines.
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="url"
              placeholder="https://example.com/sports-ground.jpg"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              style={{ flex: 1, padding: '0.75rem 1rem' }}
            />
            <button type="button" onClick={handleAddImage} className="btn btn-secondary">
              <Plus size={16} />
              <span>Add URL</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
            {imagesList.map((url, i) => (
              <div
                key={i}
                style={{
                  position: 'relative',
                  height: '100px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <img src={url} alt={`Preview ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    backgroundColor: 'rgba(239, 68, 68, 0.85)',
                    color: '#fff',
                    borderRadius: '4px',
                    padding: '3px',
                    display: 'flex',
                  }}
                  aria-label="Remove image"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submission Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <Link to="/owner/turfs" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-lime btn-lg" disabled={submitting}>
            <Save size={18} />
            <span>{submitting ? 'Saving...' : isEdit ? 'Update Facility' : 'Submit Facility'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditTurf;
