const db = require('../../config/db'); // Your database connection

// Method to get hotel details by ID
const getRiderDetailsById = (req, res) => {
  const riderId = parseInt(req.params.rider_id, 10); 
  const jwtHotelId = parseInt(req.user.id, 10); 
  
  // Compare JWT ID and hotel ID
  if (jwtHotelId !== riderId) {
    return res.status(403).json({ message: 'You do not have permission to access this resource' });
  }

  // Query to get rider details by ID
  const query = `
  SELECT id, email, name, phone_number, address, NIC, laundry_id 
  FROM deliveryRiders 
  WHERE id = ?;
`;

  // Execute the query
  db.query(query, [riderId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving rider details', error: err });
    }

    // Check if hotel was found
    if (results.length === 0) {
      return res.status(404).json({ message: 'Rider not found' });
    }

    // Return the hotel details
    res.status(200).json({
      message: 'Rider details retrieved successfully',
      rider: results[0]
    });
  });
};

module.exports = { getRiderDetailsById };
