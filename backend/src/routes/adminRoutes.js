const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateMongoId } = require('../validators/turfValidator');

// Protect all admin routes: user must be authenticated with role 'admin'
router.use(authenticate, authorize('admin'));

router.get('/turfs', adminController.getAdminTurfs);
router.patch('/turfs/:id/verification', validateMongoId('id'), adminController.updateTurfVerification);
router.get('/users', adminController.getAdminUsers);

module.exports = router;
