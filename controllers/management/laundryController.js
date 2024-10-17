const db = require('../../config/db'); // Your database connection

// Method to get hotel details by ID
const getLaundryDetailsById = (req, res) => {
  const laundryId = parseInt(req.params.laundry_id, 10); 
  const jwtLaundryId = parseInt(req.user.id, 10); 
  
  // Compare JWT ID and hotel ID
  if (jwtLaundryId !== laundryId) {
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
      laundry: results[0]
    });
  });
};

const declineOrderByLaundry = (req, res) => {
  const { order_id, laundry_id } = req.params; // Assuming both order_id and laundry_id are passed as URL parameters
  const jwtLaundryId = parseInt(req.user.id, 10); 
  
  if (jwtLaundryId !== parseInt(laundry_id,10)) {
    return res.status(403).json({ message: 'You do not have permission to access this resource' });
  }

  const query = `
    UPDATE orders 
    SET laundry_id = NULL, orderStatus = 0 
    WHERE id = ? AND orderStatus = 1 AND laundry_id = ?
  `;

  // Execute the query
  db.query(query, [order_id, laundry_id], (err, result) => {
    if (err) {
      console.error("Error declining the order: ", err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found or not assigned to this laundry or status not in 1' });
    }

    return res.status(200).json({ message: 'Order successfully declined' });
  });
};


module.exports = { getLaundryDetailsById , declineOrderByLaundry};
