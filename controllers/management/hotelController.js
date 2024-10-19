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

const getOrdersByHotelId = (req, res) => {
  const { hotel_id } = req.params;

  // Ensure that the hotel_id from the JWT matches the hotel_id being requested
  if (req.user.id !== parseInt(hotel_id, 10)) {
      return res.status(403).json({ message: 'You do not have permission to access this resource' });
  }

  // Query to fetch all clothing items by hotel_id
  const query = `
      SELECT * FROM orders 
      WHERE hotel_id = ?
  `;

  db.query(query, [hotel_id], (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'Error fetching orders', error: err });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'No orders found for this hotel' });
      }

      res.status(200).json({ orders: results });
  });
};


const requestOrderToLaundry = (req, res) => {
  const { orderId, laundry_id} = req.body;
  const { hotel_id} = req.params;

  if (req.user.id !== parseInt(hotel_id,10)) {
    return res.status(403).json({ message: 'You do not have permission to access this resource' });
  }

  // Validate that orderId and laundry_id are provided
  if (!orderId || !laundry_id) {
    return res.status(400).json({ message: 'Order ID and Laundry ID are required.' });
  }

  // Query to check the current status of the order
  const checkOrderStatusQuery = `
    SELECT orderStatus, hotel_id FROM orders 
    WHERE id = ?
  `;

  db.query(checkOrderStatusQuery, [orderId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error checking order status', error: err });
    }

    // Check if the order exists and has the correct status
    if (results.length === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const order = results[0];

    // Ensure that the hotel_id from the JWT matches the hotel_id being requested
    if (req.user.id !== order.hotel_id) {
      return res.status(403).json({ message: 'You do not have permission to access this resource' });
    }
    

    if (order.orderStatus !== 0) {
      return res.status(400).json({ message: 'Only orders with status 0 can be requested to laundry.' });
    }

    // Query to update the order with laundry_id and change the status
    const updateOrderQuery = `
      UPDATE orders 
      SET laundry_id = ?, orderStatus = 1 
      WHERE id = ?
    `;

    db.query(updateOrderQuery, [laundry_id, orderId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating order', error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Failed to update order. Order may not exist.' });
      }

      res.status(200).json({ message: 'Order requested to laundry successfully.', orderId });
    });
  });
};

const declineOrderByHotel = (req, res) => {
  const { order_id, hotel_id } = req.params; // Assuming both order_id and laundry_id are passed as URL parameters
  const jwtHotelId = parseInt(req.user.id, 10); 
  
  if (jwtHotelId !== parseInt(hotel_id,10)) {
    return res.status(403).json({ message: 'You do not have permission to access this resource' });
  }

  const query = `
    UPDATE orders 
    SET laundry_id = NULL, orderStatus = 0 
    WHERE id = ? AND orderStatus = 2 AND hotel_id = ?
  `;

  // Execute the query
  db.query(query, [order_id, hotel_id], (err, result) => {
    if (err) {
      console.error("Error declining the order: ", err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found or not assigned to this hotel or status not in 2' });
    }

    return res.status(200).json({ message: 'Order successfully declined' });
  });
};

module.exports = { getHotelDetailsById, getOrdersByHotelId, requestOrderToLaundry, declineOrderByHotel };
