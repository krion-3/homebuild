const db = require('../config/db');

// Record a payment (homeowner)
const makePayment = async (req, res) => {
  const { project_id, amount, payment_method, reference_number, notes } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO payments (project_id, homeowner_id, amount, payment_method, status, reference_number, notes)
       VALUES ($1, $2, $3, $4, 'pending', $5, $6) RETURNING *`,
      [project_id, req.user.id, amount, payment_method, reference_number, notes]
    );

    res.status(201).json({
      message: 'Payment recorded successfully, awaiting confirmation',
      payment: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all payments for a project
const getProjectPayments = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
        p.*,
        u.full_name AS homeowner_name
       FROM payments p
       LEFT JOIN users u ON p.homeowner_id = u.id
       WHERE p.project_id = $1
       ORDER BY p.payment_date DESC`,
      [req.params.project_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get homeowner's own payments
const getMyPayments = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
        p.*,
        pr.location
       FROM payments p
       LEFT JOIN projects pj ON p.project_id = pj.id
       LEFT JOIN properties pr ON pj.property_id = pr.id
       WHERE p.homeowner_id = $1
       ORDER BY p.payment_date DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Confirm or reject a payment (admin)
const updatePaymentStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const result = await db.query(
      `UPDATE payments SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({
      message: `Payment ${status} successfully`,
      payment: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get payment summary for a project
const getPaymentSummary = async (req, res) => {
  try {
    const project = await db.query(
      'SELECT total_cost, funded_amount, homeowner_contribution FROM projects WHERE id = $1',
      [req.params.project_id]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const payments = await db.query(
      `SELECT COALESCE(SUM(amount), 0) AS total_paid
       FROM payments 
       WHERE project_id = $1 AND status = 'confirmed'`,
      [req.params.project_id]
    );

    const { total_cost, funded_amount, homeowner_contribution } = project.rows[0];
    const total_paid = parseFloat(payments.rows[0].total_paid);
    const balance = parseFloat(homeowner_contribution) - total_paid;

    res.json({
      total_cost: parseFloat(total_cost),
      funded_amount: parseFloat(funded_amount),
      homeowner_contribution: parseFloat(homeowner_contribution),
      total_paid,
      balance: balance < 0 ? 0 : balance
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { makePayment, getProjectPayments, getMyPayments, updatePaymentStatus, getPaymentSummary };