const db = require('../../config/db');
const { formatDateForMySQL } = require('../../utils/dateTimeHelper');

// Create a new order and assign items to the order
const createOrder = (req, res) => {
  const{hotel_id} = req.params;
  const { 
    pickupFromHotelDateTime, 
    handedToLaundryDateTime, 
    laundryCompletedDateTime, 
    pickupFromLaundryDateTime, 
    orderCompletedDateTime, 
    weight,
    special_notes, 
    itemIds 
  } = req.body;

  if(req.user.id !== parseInt(hotel_id,10)){
    return res.status(403).json({message: 'You do not have permission to access this resource'});
  }

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

    // Query to insert a new order (without the price column)
    const orderQuery = `
      INSERT INTO orders (hotel_id, orderStatus, pickupFromHotelDateTime, handedToLaundryDateTime, laundryCompletedDateTime, pickupFromLaundryDateTime, orderCompletedDateTime, weight, special_notes,created_time) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,NOW())
    `;

    const orderValues = [
      hotel_id,
      orderStatus,
      pickupFromHotelDateTime || null,
      handedToLaundryDateTime || null,
      laundryCompletedDateTime || null,
      pickupFromLaundryDateTime || null,
      orderCompletedDateTime || null,
      weight || null,
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


const pickupOrderFromHotel = (req, res) => {
  const { orderId, pickupTime } = req.body;

  // Ensure that the rider_id from the JWT exists
  if (!req.user.id) {
    return res.status(403).json({ message: 'Rider ID not found in JWT.' });
  }

  // Validate that orderId and pickupTime are provided
  if (!orderId || !pickupTime) {
    return res.status(400).json({ message: 'Order ID and pickup time are required.' });
  }

  // Format the pickupTime using the helper
  const formattedPickupTime = formatDateForMySQL(pickupTime);

  // Query to check the current status of the order and ensure the deliveryRiderId matches the rider_id
  const checkOrderStatusQuery = `
    SELECT orderStatus, pickup_delivery_rider_id FROM orders 
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

    // Ensure the delivery rider matches the one assigned to the order
    if (order.pickup_delivery_rider_id !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to pick up this order.' });
    }

    // Ensure that the order is in status 3 (accepted by hotel)
    if (order.orderStatus !== 3) {
      return res.status(400).json({ message: 'Only orders with status 3 can be picked up by a rider.' });
    }

    // Query to update the order status to 4 and set the pickup time
    const updateOrderQuery = `
      UPDATE orders 
      SET orderStatus = 4, pickupfromHotelDateTime = ? 
      WHERE id = ?
    `;

    db.query(updateOrderQuery, [formattedPickupTime, orderId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating order', error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Failed to update order. Order may not exist.' });
      }

      res.status(200).json({ 
        message: 'Order picked up successfully by rider.', 
        orderId, 
        pickupTime: formattedPickupTime 
      });
    });
  });
};

const handedToLaundryByRider = (req, res) => {
  const { orderId, dropTime } = req.body;

  // Ensure that the rider_id from the JWT exists
  if (!req.user.id) {
    return res.status(403).json({ message: 'Rider ID not found in JWT.' });
  }

  // Validate that orderId and pickupTime are provided
  if (!orderId || !dropTime) {
    return res.status(400).json({ message: 'Order ID and dop time are required.' });
  }

  // Format the pickupTime using the helper
  const formattedDropTime = formatDateForMySQL(dropTime);

  // Query to check the current status of the order and ensure the deliveryRiderId matches the rider_id
  const checkOrderStatusQuery = `
    SELECT orderStatus, pickup_delivery_rider_id FROM orders 
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

    // Ensure the delivery rider matches the one assigned to the order
    if (order.pickup_delivery_rider_id !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to drop this order.' });
    }

    // Ensure that the order is in status 3 (accepted by hotel)
    if (order.orderStatus !== 4) {
      return res.status(400).json({ message: 'Only orders with status 4 can be dropped by a rider.' });
    }

    // Query to update the order status to 4 and set the pickup time
    const updateOrderQuery = `
      UPDATE orders 
      SET orderStatus = 5, handedToLaundryDateTime = ? 
      WHERE id = ?
    `;

    db.query(updateOrderQuery, [formattedDropTime, orderId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating order', error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Failed to update order. Order may not exist.' });
      }

      res.status(200).json({ 
        message: 'Order dropeed successfully by rider.', 
        orderId, 
        dropTime: formattedDropTime 
      });
    });
  });
};

const laundryCompleted = (req, res) => {
  const { orderId, completedTime } = req.body;

  // Ensure that the rider_id from the JWT exists
  if (!req.user.id) {
    return res.status(403).json({ message: 'Rider ID not found in JWT.' });
  }

  // Validate that orderId and pickupTime are provided
  if (!orderId || !completedTime) {
    return res.status(400).json({ message: 'Order ID and completed time are required.' });
  }

  // Format the pickupTime using the helper
  const formattedCompletedTime = formatDateForMySQL(completedTime);

  // Query to check the current status of the order and ensure the deliveryRiderId matches the rider_id
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

    // Ensure the delivery rider matches the one assigned to the order
    if (order.laundry_id !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to complete this order.' });
    }

    // Ensure that the order is in status 3 (accepted by hotel)
    if (order.orderStatus !== 5) {
      return res.status(400).json({ message: 'Only orders with status 5 can be completed by a laundry.' });
    }

    // Query to update the order status to 4 and set the pickup time
    const updateOrderQuery = `
      UPDATE orders 
      SET orderStatus = 6, laundryCompletedDateTime = ? 
      WHERE id = ?
    `;

    db.query(updateOrderQuery, [formattedCompletedTime, orderId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating order', error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Failed to update order. Order may not exist.' });
      }

      res.status(200).json({ 
        message: 'Order completed successfully by laundry.', 
        orderId, 
        completedTime: formattedCompletedTime 
      });
    });
  });
};


const pickupOrderFromLaundry = (req, res) => {
  const { orderId, pickupTime } = req.body;

  // Ensure that the rider_id from the JWT exists
  if (!req.user.id) {
    return res.status(403).json({ message: 'Rider ID not found in JWT.' });
  }

  // Validate that orderId and pickupTime are provided
  if (!orderId || !pickupTime) {
    return res.status(400).json({ message: 'Order ID and pickup time are required.' });
  }

  // Format the pickupTime using the helper
  const formattedPickupTime = formatDateForMySQL(pickupTime);

  // Query to check the current status of the order and ensure the deliveryRiderId matches the rider_id
  const checkOrderStatusQuery = `
    SELECT orderStatus, drop_delivery_rider_id FROM orders 
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

    // Ensure the delivery rider matches the one assigned to the order
    if (order.drop_delivery_rider_id !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to pick up this order.' });
    }

    // Ensure that the order is in status 3 (accepted by hotel)
    if (order.orderStatus !== 6) {
      return res.status(400).json({ message: 'Only orders with status 6 can be picked up by a rider.' });
    }

    // Query to update the order status to 4 and set the pickup time
    const updateOrderQuery = `
      UPDATE orders 
      SET orderStatus = 7, pickupFromLaundryDateTime = ? 
      WHERE id = ?
    `;

    db.query(updateOrderQuery, [formattedPickupTime, orderId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating order', error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Failed to update order. Order may not exist.' });
      }

      res.status(200).json({ 
        message: 'Order picked up successfully by rider.', 
        orderId, 
        pickupTime: formattedPickupTime 
      });
    });
  });
};

const completeOrder = (req, res) => {
  const { orderId, completedTime } = req.body;

  // Ensure that the rider_id from the JWT exists
  if (!req.user.id) {
    return res.status(403).json({ message: 'Rider ID not found in JWT.' });
  }

  // Validate that orderId and pickupTime are provided
  if (!orderId || !completedTime) {
    return res.status(400).json({ message: 'Order ID and pickup time are required.' });
  }

  // Format the completed time using the helper
  const formattedPickupTime = formatDateForMySQL(completedTime);

  // Query to check the current status of the order and ensure the deliveryRiderId matches the rider_id
  const checkOrderStatusQuery = `
    SELECT orderStatus, drop_delivery_rider_id FROM orders 
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

    // Ensure the delivery rider matches the one assigned to the order
    if (order.drop_delivery_rider_id !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to pick up this order.' });
    }

    // Ensure that the order is in status 3 (accepted by hotel)
    if (order.orderStatus !== 7) {
      return res.status(400).json({ message: 'Only orders with status 7 can be picked up by a rider.' });
    }

    // Query to update the order status to 4 and set the pickup time
    const updateOrderQuery = `
      UPDATE orders 
      SET orderStatus = 8, orderCompletedDateTime = ? 
      WHERE id = ?
    `;

    db.query(updateOrderQuery, [formattedPickupTime, orderId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating order', error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Failed to update order. Order may not exist.' });
      }

      res.status(200).json({ 
        message: 'Order completed successfully by rider.', 
        orderId, 
        completedTime: formattedPickupTime 
      });
    });
  });
};






module.exports = { 
  createOrder , 
  pickupOrderFromHotel,
  handedToLaundryByRider,
  laundryCompleted,
  pickupOrderFromLaundry,
  completeOrder
};
