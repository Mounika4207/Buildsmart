const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const turfRoutes = require('./turfRoutes');
const bookingRoutes = require('./bookingRoutes');
const ownerRoutes = require('./ownerRoutes');
const adminRoutes = require('./adminRoutes');

// API Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'PlayArena API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.use('/auth', authRoutes);
router.use('/turfs', turfRoutes);
router.use('/bookings', bookingRoutes);
router.use('/owner', ownerRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
