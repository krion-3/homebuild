const express = require('express');
const router = express.Router();
const { createProperty, getAllProperties, getMyProperties, verifyProperty } = require('../controllers/property.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary');

router.use(protect);

router.post('/', upload.single('title_deed'), createProperty);
router.get('/my', getMyProperties);
router.get('/', adminOnly, getAllProperties);
router.patch('/:id/verify', adminOnly, verifyProperty);

module.exports = router;