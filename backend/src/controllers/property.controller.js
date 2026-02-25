const db = require('../config/db');
const { uploadToCloudinary } = require('../config/cloudinary');

// Create property with title deed upload
const createProperty = async (req, res) => {
  const { location, land_size } = req.body;

  try {
    let title_deed_url = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'homebuild/title_deeds');
      title_deed_url = result.secure_url;
    }

    const result = await db.query(
      `INSERT INTO properties (homeowner_id, title_deed_url, location, land_size, verified)
       VALUES ($1, $2, $3, $4, false) RETURNING *`,
      [req.user.id, title_deed_url, location, land_size]
    );

    res.status(201).json({
      message: 'Property submitted successfully, awaiting verification',
      property: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all properties (admin)
const getAllProperties = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        pr.*,
        u.full_name AS homeowner_name,
        u.email AS homeowner_email,
        u.phone AS homeowner_phone
      FROM properties pr
      LEFT JOIN users u ON pr.homeowner_id = u.id
      ORDER BY pr.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get homeowner's own properties
const getMyProperties = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM properties WHERE homeowner_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify a property (admin only)
const verifyProperty = async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE properties SET verified = true WHERE id = $1 RETURNING *`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({
      message: 'Property verified successfully',
      property: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createProperty, getAllProperties, getMyProperties, verifyProperty };