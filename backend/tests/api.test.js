const { test, before, after, describe } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const Turf = require('../src/models/Turf');
const Booking = require('../src/models/Booking');

describe('PlayArena API End-to-End Test Suite', () => {
  let customerToken = '';
  let ownerToken = '';
  let adminToken = '';
  let customerUser = null;
  let testTurf = null;

  before(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
  });

  after(async () => {
    await mongoose.connection.close();
  });

  // 1. Health & Welcome
  test('GET / - Welcome route should return status 200', async () => {
    const res = await request(app).get('/');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'online');
  });

  test('GET /api/health - Health check route should return status 200 and ok', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'ok');
  });

  // 2. Authentication
  test('POST /api/auth/register - Successfully register new customer', async () => {
    const uniqueEmail = `testplayer_${Date.now()}@example.com`;
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test Athlete',
      email: uniqueEmail,
      password: 'password123',
      phone: '+91 91234 56789',
      role: 'customer',
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.token);
    assert.strictEqual(res.body.user.email, uniqueEmail);
    assert.strictEqual(res.body.user.role, 'customer');
    assert.strictEqual(res.body.user.password, undefined); // Never leak password!
  });

  test('POST /api/auth/register - Reject public admin role creation', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Fake Admin',
      email: `fakeadmin_${Date.now()}@example.com`,
      password: 'password123',
      role: 'admin',
    });

    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.success, false);
  });

  test('POST /api/auth/login - Successfully login with seeded customer', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'aditya@example.com',
      password: 'password123',
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.token);
    customerToken = res.body.token;
    customerUser = res.body.user;
  });

  test('POST /api/auth/login - Reject invalid password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'aditya@example.com',
      password: 'wrong_password',
    });

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  test('POST /api/auth/login - Successfully login with seeded owner and admin', async () => {
    const ownerRes = await request(app).post('/api/auth/login').send({
      email: 'rajesh.owner@playarena.example',
      password: 'password123',
    });
    assert.strictEqual(ownerRes.status, 200);
    ownerToken = ownerRes.body.token;

    const adminRes = await request(app).post('/api/auth/login').send({
      email: 'admin@playarena.example',
      password: 'password123',
    });
    assert.strictEqual(adminRes.status, 200);
    adminToken = adminRes.body.token;
  });

  test('GET /api/auth/me - Retrieve authenticated profile with JWT', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${customerToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.user.email, 'aditya@example.com');
  });

  // 3. Turfs Discovery
  test('GET /api/turfs - Fetch list of turfs with query filters', async () => {
    const res = await request(app).get('/api/turfs').query({
      city: 'Bengaluru',
      sport: 'football',
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.turfs));
    assert.ok(res.body.turfs.length > 0);
    testTurf = res.body.turfs[0];
  });

  test('GET /api/turfs/featured - Fetch featured facilities', async () => {
    const res = await request(app).get('/api/turfs/featured');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.turfs.length > 0);
  });

  test('GET /api/turfs/:id - Fetch single turf by ID', async () => {
    const res = await request(app).get(`/api/turfs/${testTurf._id}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.turf.name, testTurf.name);
  });

  test('GET /api/turfs/:id/availability - Fetch slot matrix for date', async () => {
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const res = await request(app)
      .get(`/api/turfs/${testTurf._id}/availability`)
      .query({ date: tomorrowStr });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.slots));
    assert.ok(res.body.slots.length > 0);
  });

  // 4. Bookings & Concurrency Overlap Prevention
  test('POST /api/bookings - Create booking with authoritative price calculation', async () => {
    const nextWeekStr = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        turfId: testTurf._id,
        date: nextWeekStr,
        startTime: '16:00',
        duration: 2,
        sport: 'football',
        paymentMethod: 'Pay at Venue',
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.booking.duration, 2);
    // Authoritative total must equal turf.pricePerHour * 2
    assert.strictEqual(res.body.booking.totalAmount, testTurf.pricePerHour * 2);
    assert.ok(res.body.booking.bookingReference.startsWith('PA-2026-'));

    // Test Overlap Conflict Prevention: Attempting to book overlapping slot (17:00 - 18:00) must return 409
    const conflictRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        turfId: testTurf._id,
        date: nextWeekStr,
        startTime: '17:00',
        duration: 1,
        sport: 'football',
      });

    assert.strictEqual(conflictRes.status, 409);
    assert.strictEqual(conflictRes.body.success, false);
    assert.match(conflictRes.body.message, /already been reserved/i);
  });

  test('GET /api/bookings/my - Retrieve authenticated user bookings', async () => {
    const res = await request(app)
      .get('/api/bookings/my')
      .set('Authorization', `Bearer ${customerToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.bookings));
  });

  // 5. Role Guards & Permissions
  test('RoleGuard - Customer is forbidden from accessing Owner endpoints (403)', async () => {
    const res = await request(app)
      .get('/api/owner/turfs')
      .set('Authorization', `Bearer ${customerToken}`);

    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.success, false);
  });

  test('RoleGuard - Owner is forbidden from accessing Admin endpoints (403)', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${ownerToken}`);

    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.success, false);
  });

  test('RoleGuard - Admin can view user directory and audit turfs', async () => {
    const userRes = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(userRes.status, 200);
    assert.strictEqual(userRes.body.success, true);
    assert.ok(userRes.body.users.length >= 5);
  });
});
