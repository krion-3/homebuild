const db = require('../config/db');
const { uploadToCloudinary } = require('../config/cloudinary');

// Create milestone (admin)
const createMilestone = async (req, res) => {
  const { project_id, title, description, due_date } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO milestones (project_id, title, description, status, due_date)
       VALUES ($1, $2, $3, 'pending', $4) RETURNING *`,
      [project_id, title, description, due_date]
    );

    res.status(201).json({
      message: 'Milestone created successfully',
      milestone: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all milestones for a project
const getProjectMilestones = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT m.*, 
        COUNT(pu.id) AS update_count
       FROM milestones m
       LEFT JOIN progress_updates pu ON m.id = pu.milestone_id
       WHERE m.project_id = $1
       GROUP BY m.id
       ORDER BY m.due_date ASC`,
      [req.params.project_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update milestone status (engineer)
const updateMilestoneStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const completed_at = status === 'completed' ? new Date() : null;

    const result = await db.query(
      `UPDATE milestones SET status = $1, completed_at = $2 WHERE id = $3 RETURNING *`,
      [status, completed_at, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    res.json({
      message: 'Milestone status updated',
      milestone: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload progress update with photo (engineer)
const uploadProgressUpdate = async (req, res) => {
  const { milestone_id, caption } = req.body;

  try {
    let photo_url = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'homebuild/progress');
      photo_url = result.secure_url;
    }

    const result = await db.query(
      `INSERT INTO progress_updates (milestone_id, engineer_id, photo_url, caption)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [milestone_id, req.user.id, photo_url, caption]
    );

    res.status(201).json({
      message: 'Progress update uploaded successfully',
      update: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all progress updates for a milestone
const getMilestoneUpdates = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
        pu.*,
        u.full_name AS engineer_name
       FROM progress_updates pu
       LEFT JOIN users u ON pu.engineer_id = u.id
       WHERE pu.milestone_id = $1
       ORDER BY pu.uploaded_at DESC`,
      [req.params.milestone_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createMilestone, getProjectMilestones, updateMilestoneStatus, uploadProgressUpdate, getMilestoneUpdates };