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

const getOrdersByLaundryId = (req, res) => {
  const { laundry_id } = req.params;

  // Ensure that the hotel_id from the JWT matches the hotel_id being requested
  if (req.user.id !== parseInt(laundry_id, 10)) {
      return res.status(403).json({ message: 'You do not have permission to access this resource' });
  }

  // Query to fetch all clothing items by hotel_id
  const query = `
      SELECT * FROM orders 
      WHERE laundry_id = ?
  `;

  db.query(query, [laundry_id], (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'Error fetching orders', error: err });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'No orders found for this hotel' });
      }

      res.status(200).json({ orders: results });
  });
};

const acceptOrderByLaundry = (req, res) => {
  const { laundry_id, orderId } = req.params;
  const { price } = req.body;

  if(req.user.id !== parseInt(laundry_id,10)){
    return res.status(403).json({message: 'You do not have permission to access this resource'})
  }
  // Validate that orderId and price are provided
  if (!orderId || !price) {
    return res.status(400).json({ message: 'Order ID and price are required.' });
  }

  // Query to check the current status of the order and ensure it belongs to the laundry
  const checkOrderStatusQuery = `
    SELECT orderStatus, laundry_id FROM orders 
    WHERE id = ?
  `;

  db.query(checkOrderStatusQuery, [orderId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error checking order status', error: err });
    }

    // Check if the order exists
    if (results.length === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const order = results[0];

    if (req.user.id !== order.laundry_id) {
      return res.status(403).json({ message: 'You do not have permission to access this resource' });
    }

    // Ensure that the order is in status 1 (requested to laundry) and belongs to the current laundry
    if (order.orderStatus !== 1) {
      return res.status(400).json({ message: 'Only orders with status 1 can be accepted by laundry.' });
    }

    // Query to update the order with the price and change the status to 2 (accepted by laundry)
    const updateOrderQuery = `
      UPDATE orders 
      SET price = ?, orderStatus = 2 
      WHERE id = ?
    `;

    db.query(updateOrderQuery, [price, orderId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating order', error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Failed to update order. Order may not exist.' });
      }

      res.status(200).json({ message: 'Order accepted by laundry successfully.', orderId });
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


module.exports = { 
  getLaundryDetailsById ,
  getOrdersByLaundryId, 
  acceptOrderByLaundry,
  declineOrderByLaundry};
