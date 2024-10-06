const db = require('../../config/db');

// Create a new order and assign items to the order
const createOrder = (req, res) => {
  const { 
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

  // Query to check the status of the items before assigning
  const checkItemStatusQuery = `
    SELECT id FROM clothingItems 
    WHERE id IN (?) AND itemStatus = 0
  `;

  // Check if all items are eligible for assignment
  db.query(checkItemStatusQuery, [itemIds], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error checking item status', error: err });
    }

    // If no items found or not all items are eligible, respond with an error
    if (results.length !== itemIds.length) {
      return res.status(400).json({ message: 'All items must have itemStatus of 0 to be assigned to an order.' });
    }

    // Query to insert a new order
    const orderQuery = `
      INSERT INTO orders (orderStatus, pickupFromHotelDateTime, handedToLaundryDateTime, laundryCompletedDateTime, pickupFromLaundryDateTime, orderCompletedDateTime, special_notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const orderValues = [
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

module.exports = { createOrder };
