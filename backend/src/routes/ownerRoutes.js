const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateTurfInput, validateMongoId } = require('../validators/turfValidator');

// Protect all owner routes: user must be authenticated with role 'owner' or 'admin'
router.use(authenticate, authorize('owner', 'admin'));

router.get('/turfs', ownerController.getOwnerTurfs);
router.post('/turfs', validateTurfInput, ownerController.createTurf);
router.patch('/turfs/:id', validateMongoId('id'), ownerController.updateTurf);
router.delete('/turfs/:id', validateMongoId('id'), ownerController.deleteTurf);

router.get('/bookings', ownerController.getOwnerBookings);
router.get('/schedule/:turfId', validateMongoId('turfId'), ownerController.getOwnerSchedule);
router.post('/schedule/:turfId/block', validateMongoId('turfId'), ownerController.toggleBlockSlot);

module.exports = router;
