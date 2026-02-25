const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Admin creates a new user account
const createUser = async (req, res) => {
  const { full_name, email, password, role, phone } = req.body;

  try {
    // Check if email already exists
    const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const result = await db.query(
      `INSERT INTO users (full_name, email, password_hash, role, phone, is_active)
       VALUES ($1, $2, $3, $4, $5, true) RETURNING id, full_name, email, role, phone, created_at`,
      [full_name, email, password_hash, role, phone]
    );

    res.status(201).json({
      message: 'User account created successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, full_name, email, role, phone, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single user
const getUserById = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, full_name, email, role, phone, is_active, created_at FROM users WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Activate or deactivate a user
const toggleUserStatus = async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE users SET is_active = NOT is_active WHERE id = $1
       RETURNING id, full_name, email, role, is_active`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: `User ${result.rows[0].is_active ? 'activated' : 'deactivated'} successfully`,
      user: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createUser, getAllUsers, getUserById, toggleUserStatus };