const db = require('../../config/db'); // Your database connection

// Method to get hotel details by ID
const getLaundryDetailsById = (req, res) => {
  const laundryId = parseInt(req.params.laundry_id, 10); 
  const jwtHotelId = parseInt(req.user.id, 10); 
  
  // Compare JWT ID and hotel ID
  if (jwtHotelId !== laundryId) {
    return res.status(403).json({ message: 'You do not have permission to access this resource' });
  }

  // Query to get laundry details by ID
  const query = `
    SELECT id, email, laundry_name, phone_number, address, nearest_city, bank_name, bank_account_number, bank_account_holder_name, bank_branch
    FROM laundry 
    WHERE id = ?
  `;

  // Execute the query
  db.query(query, [laundryId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving laundry details', error: err });
    }

    // Check if hotel was found
    if (results.length === 0) {
      return res.status(404).json({ message: 'Laundry not found' });
    }

    // Return the hotel details
    res.status(200).json({
      message: 'Laundry details retrieved successfully',
      hotel: results[0]
    });
  });
};

module.exports = { getLaundryDetailsById };
