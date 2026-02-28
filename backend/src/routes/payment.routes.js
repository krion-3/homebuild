const express = require('express');
const router = express.Router();
const { makePayment, getProjectPayments, getMyPayments, updatePaymentStatus, getPaymentSummary, getAllPayments } = require('../controllers/payment.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/', makePayment);
router.get('/', adminOnly, getAllPayments);
router.get('/my', getMyPayments);
router.get('/project/:project_id', getProjectPayments);
router.get('/summary/:project_id', getPaymentSummary);
router.patch('/:id/status', adminOnly, updatePaymentStatus);

module.exports = router;