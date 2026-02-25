const express = require('express');
const router = express.Router();
const { createProject, getAllProjects, getProjectById, getHomeownerProjects, updateProjectStatus } = require('../controllers/project.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/my', getHomeownerProjects);
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', adminOnly, createProject);
router.patch('/:id/status', adminOnly, updateProjectStatus);

module.exports = router;