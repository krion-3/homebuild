const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, getUserById, toggleUserStatus } = require('../controllers/user.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect);
router.use(adminOnly);

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.patch('/:id/toggle', toggleUserStatus);

module.exports = router;