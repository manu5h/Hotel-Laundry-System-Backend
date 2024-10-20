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

const setPickupDeliveryRider = (req, res) => {
  const { orderId, pickupDeliveryRiderId } = req.body;

  // Ensure that the laundry_id from the JWT exists
  if (!req.user.id) {
    return res.status(403).json({ message: 'Laundry ID not found in JWT.' });
  }

  // Validate that orderId and deliveryRiderId are provided
  if (!orderId || !pickupDeliveryRiderId) {
    return res.status(400).json({ message: 'Order ID and Delivery Rider ID are required.' });
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

    // Ensure that the order belongs to the current laundry
    if (order.laundry_id !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to assign a delivery rider to this order.' });
    }

    // Ensure that the order is in the correct status to assign a delivery rider 
    if (order.orderStatus !== 3) {
      return res.status(400).json({ message: 'Only orders with status 3 can have a delivery rider assigned.' });
    }

    // Query to update the order with the delivery rider ID
    const updateOrderQuery = `
      UPDATE orders 
      SET pickup_delivery_rider_id = ? 
      WHERE id = ?
    `;

    db.query(updateOrderQuery, [pickupDeliveryRiderId, orderId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating order', error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Failed to update order. Order may not exist.' });
      }

      res.status(200).json({ message: 'Delivery rider assigned successfully.', orderId, pickupDeliveryRiderId });
    });
  });
};

const setDropDeliveryRider = (req, res) => {
  const { orderId, dropDeliveryRiderId } = req.body;

  // Ensure that the laundry_id from the JWT exists
  if (!req.user.id) {
    return res.status(403).json({ message: 'Laundry ID not found in JWT.' });
  }

  // Validate that orderId and deliveryRiderId are provided
  if (!orderId || !dropDeliveryRiderId) {
    return res.status(400).json({ message: 'Order ID and Delivery Rider ID are required.' });
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

    // Ensure that the order belongs to the current laundry
    if (order.laundry_id !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to assign a delivery rider to this order.' });
    }

    // Ensure that the order is in the correct status to assign a delivery rider 
    if (order.orderStatus !== 6) {
      return res.status(400).json({ message: 'Only orders with status 6 can have a delivery rider assigned.' });
    }

    // Query to update the order with the delivery rider ID
    const updateOrderQuery = `
      UPDATE orders 
      SET drop_delivery_rider_id = ? 
      WHERE id = ?
    `;

    db.query(updateOrderQuery, [dropDeliveryRiderId, orderId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating order', error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Failed to update order. Order may not exist.' });
      }

      res.status(200).json({ message: 'Delivery rider assigned successfully.', orderId, dropDeliveryRiderId });
    });
  });
};

module.exports = { getRiderDetailsById, setPickupDeliveryRider, setDropDeliveryRider };
