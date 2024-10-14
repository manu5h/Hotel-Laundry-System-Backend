const db = require('../../config/db'); // Your database connection

// Method to get hotel details by ID
const getHotelDetailsById = (req, res) => {
  const hotelId = parseInt(req.params.hotel_id, 10); 
  const jwtHotelId = parseInt(req.user.id, 10); 
  
  // Compare JWT ID and hotel ID
  if (jwtHotelId !== hotelId) {
    return res.status(403).json({ message: 'You do not have permission to access this resource' });
  }

  // Query to get hotel details by ID
  const query = `
    SELECT id, email, hotel_name, phone_number, address, nearest_city 
    FROM hotel 
    WHERE id = ?
  `;

  // Execute the query
  db.query(query, [hotelId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving hotel details', error: err });
    }

    // Check if hotel was found
    if (results.length === 0) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Return the hotel details
    res.status(200).json({
      message: 'Hotel details retrieved successfully',
      hotel: results[0]
    });
  });
};

module.exports = { getHotelDetailsById };
