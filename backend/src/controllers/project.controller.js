const db = require('../config/db');

// Create a new project (admin)
const createProject = async (req, res) => {
  const { property_id, firm_id, engineer_id, total_cost, start_date, expected_end_date } = req.body;

  try {
    const funded_amount = total_cost * 0.70;
    const homeowner_contribution = total_cost * 0.30;

    const result = await db.query(
      `INSERT INTO projects (property_id, firm_id, engineer_id, total_cost, funded_amount, homeowner_contribution, status, start_date, expected_end_date)
       VALUES ($1, $2, $3, $4, $5, $6, 'active', $7, $8)
       RETURNING *`,
      [property_id, firm_id, engineer_id, total_cost, funded_amount, homeowner_contribution, start_date, expected_end_date]
    );

    res.status(201).json({
      message: 'Project created successfully',
      project: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all projects (admin)
const getAllProjects = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.*,
        pr.location,
        pr.title_deed_url,
        u1.full_name AS firm_name,
        u2.full_name AS engineer_name,
        u3.full_name AS homeowner_name
      FROM projects p
      LEFT JOIN properties pr ON p.property_id = pr.id
      LEFT JOIN users u1 ON p.firm_id = u1.id
      LEFT JOIN users u2 ON p.engineer_id = u2.id
      LEFT JOIN users u3 ON pr.homeowner_id = u3.id
      ORDER BY p.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single project
const getProjectById = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.*,
        pr.location,
        pr.title_deed_url,
        pr.land_size,
        u1.full_name AS firm_name,
        u2.full_name AS engineer_name,
        u3.full_name AS homeowner_name,
        u3.phone AS homeowner_phone
      FROM projects p
      LEFT JOIN properties pr ON p.property_id = pr.id
      LEFT JOIN users u1 ON p.firm_id = u1.id
      LEFT JOIN users u2 ON p.engineer_id = u2.id
      LEFT JOIN users u3 ON pr.homeowner_id = u3.id
      WHERE p.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get projects for a specific homeowner
const getHomeownerProjects = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.*,
        pr.location,
        pr.land_size,
        u1.full_name AS firm_name,
        u2.full_name AS engineer_name
      FROM projects p
      LEFT JOIN properties pr ON p.property_id = pr.id
      LEFT JOIN users u1 ON p.firm_id = u1.id
      LEFT JOIN users u2 ON p.engineer_id = u2.id
      WHERE pr.homeowner_id = $1
      ORDER BY p.created_at DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update project status
const updateProjectStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const result = await db.query(
      `UPDATE projects SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      message: 'Project status updated',
      project: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createProject, getAllProjects, getProjectById, getHomeownerProjects, updateProjectStatus };