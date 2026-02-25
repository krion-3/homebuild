const express = require('express');
const router = express.Router();
const {
  createMilestone,
  getProjectMilestones,
  updateMilestoneStatus,
  uploadProgressUpdate,
  getMilestoneUpdates
} = require('../controllers/milestone.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary');

router.use(protect);

router.post('/', adminOnly, createMilestone);
router.get('/project/:project_id', getProjectMilestones);
router.patch('/:id/status', updateMilestoneStatus);
router.post('/progress', upload.single('photo'), uploadProgressUpdate);
router.get('/:milestone_id/progress', getMilestoneUpdates);

module.exports = router;