const db = require('../../config/db');

// Create a new order and assign items to the order
const createOrder = (req, res) => {
  const { 
    hotel_id,
    pickupFromHotelDateTime, 
    handedToLaundryDateTime, 
    laundryCompletedDateTime, 
    pickupFromLaundryDateTime, 
    orderCompletedDateTime, 
    special_notes, 
    itemIds 
  } = req.body;

  // Automatically set orderStatus to 0 when creating the order
  const orderStatus = 0;

  // Validate that at least one item is assigned
  if (!itemIds || itemIds.length === 0) {
    return res.status(400).json({ message: 'Cannot create order without assigning at least one clothing item.' });
  }

  // Query to check the status and hotel_id of the items before assigning
  const checkItemStatusQuery = `
    SELECT id FROM clothingItems 
    WHERE id IN (?) AND itemStatus = 0 AND hotel_id = ?
  `;

  // Check if all items are eligible for assignment and belong to the correct hotel
  db.query(checkItemStatusQuery, [itemIds, hotel_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error checking item status and hotel_id', error: err });
    }

    // If no items found or not all items are eligible, respond with an error
    if (results.length !== itemIds.length) {
      return res.status(400).json({ message: 'All items must have itemStatus of 0 and belong to the specified hotel to be assigned to an order.' });
    }

    // Query to insert a new order
    const orderQuery = `
      INSERT INTO orders (hotel_id, orderStatus, pickupFromHotelDateTime, handedToLaundryDateTime, laundryCompletedDateTime, pickupFromLaundryDateTime, orderCompletedDateTime, special_notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const orderValues = [
      hotel_id,
      orderStatus,
      pickupFromHotelDateTime || null,
      handedToLaundryDateTime || null,
      laundryCompletedDateTime || null,
      pickupFromLaundryDateTime || null,
      orderCompletedDateTime || null,
      special_notes || null
    ];

    // First insert the order into the orders table
    db.query(orderQuery, orderValues, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error creating order', error: err });
      }

      const newOrderId = result.insertId; // Get the ID of the newly created order

      // Update the clothing items to assign them to the new order and change their status to 1
      const updateItemsQuery = `
        UPDATE clothingItems 
        SET order_id = ?, itemStatus = 1 
        WHERE id IN (?)
      `;

      db.query(updateItemsQuery, [newOrderId, itemIds], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error assigning items to order', error: err });
        }

        res.status(201).json({ message: 'Order created and items assigned successfully', orderId: newOrderId });
      });
    });
  });
};


const getOrdersByHotelId = (req, res) => {
  const { hotel_id } = req.params;

  // Ensure that the hotel_id from the JWT matches the hotel_id being requested
  if (req.hotel.id !== parseInt(hotel_id, 10)) {
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

      res.status(200).json({ clothingItems: results });
  });
};

const requestOrderToLaundry = (req, res) => {
  const { orderId, laundry_id} = req.body;
  const { hotel_id } = req.params;

  // Ensure that the hotel_id from the JWT matches the hotel_id being requested
  if (req.hotel.id !== parseInt(hotel_id, 10)) {
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


module.exports = { createOrder ,getOrdersByHotelId , requestOrderToLaundry};
