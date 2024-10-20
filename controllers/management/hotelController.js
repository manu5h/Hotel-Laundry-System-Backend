const db = require('../../config/db'); // Your database connection

// Method to get hotel details by ID
const getHotelDetailsById = (req, res) => {
  const hotel_id = parseInt(req.params.hotel_id, 10);
  const jwtHotelId = parseInt(req.user.id, 10);

  // Compare JWT ID and hotel ID
  if (jwtHotelId !== hotel_id) {
    return res.status(403).json({ message: 'You do not have permission to access this resource' });
  }

  // Query to get hotel details by ID
  const query = `
    SELECT id, email, hotel_name, phone_number, address, nearest_city 
    FROM hotel 
    WHERE id = ?
  `;

  // Execute the query
  db.query(query, [hotel_id], (err, results) => {
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

  if (req.user.id !== parseInt(hotel_id, 10)) {
    return res.status(403).json({ message: 'You do not have permission to access this resource' });
  }

  const query = `
    SELECT 
      o.*,
      ci.*,
      o.id AS order_id,
      ci.id AS clothing_item_id
    FROM orders o
    LEFT JOIN clothingItems ci ON o.id = ci.order_id
    WHERE o.hotel_id = ?
  `;

  db.query(query, [hotel_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching orders', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No orders found for this hotel' });
    }

    const orders = {};

    results.forEach(row => {
      const orderId = row.order_id;

      if (!orders[orderId]) {
        orders[orderId] = {
          id: row.order_id,
          orderStatus: row.orderStatus,
          created_time: row.created_time,
          requestedToLaundryDateTime: row.requestedToLaundryDateTime,
          confirmedByHotelDateTime: row.confirmedByHotelDateTime,
          pickupFromHotelDateTime: row.pickupFromHotelDateTime,
          handedToLaundryDateTime: row.handedToLaundryDateTime,
          laundryCompletedDateTime: row.laundryCompletedDateTime,
          pickupFromLaundryDateTime: row.pickupFromLaundryDateTime,
          orderCompletedDateTime: row.orderCompletedDateTime,
          weight: row.weight,
          special_notes: row.special_notes,
          price: row.price,
          laundry_id: row.laundry_id,
          hotel_id: row.hotel_id,
          pickup_delivery_rider_id: row.pickup_delivery_rider_id,
          drop_delivery_rider_id: row.drop_delivery_rider_id,
          review: row.review,
          clothingItems: []
        };
      }

      if (row.clothing_item_id) {
        orders[orderId].clothingItems.push({
          id: row.clothing_item_id,
          itemStatus: row.itemStatus,
          category: row.category,
          cleaningType: row.cleaningType,
          pressing_ironing: row.pressing_ironing,
          stain_removal: row.stain_removal,
          folding: row.folding,
          special_instructions: row.special_instructions,
          created_time: row.created_time
        });
      }
    });

    const response = Object.values(orders);

    res.status(200).json({ orders: response });
  });
};


const requestOrderToLaundry = (req, res) => {
  const { orderId, laundry_id } = req.body;
  const { hotel_id } = req.params;

  if (req.user.id !== parseInt(hotel_id, 10)) {
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
      SET laundry_id = ?, orderStatus = 1, requestedToLaundryDateTime = NOW() 
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

const acceptOrderByHotel = (req, res) => {
  const { hotel_id, orderId } = req.params;

  if (req.user.id !== parseInt(hotel_id, 10)) {
    return res.status(403).json({ message: 'You do not have permission to accept this order.' });
  }

  // Validate that orderId is provided
  if (!orderId) {
    return res.status(400).json({ message: 'Order ID is required.' });
  }

  // Query to check the current status of the order and ensure it belongs to the hotel
  const checkOrderStatusQuery = `
    SELECT orderStatus, hotel_id FROM orders 
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

    // Ensure that the order belongs to the hotel and the status is 2 (accepted by laundry)
    if (req.user.id !== order.hotel_id) {
      return res.status(403).json({ message: 'You do not have permission to accept this order.' });
    }

    if (order.orderStatus !== 2) {
      return res.status(400).json({ message: 'Only orders with status 2 can be accepted by the hotel.' });
    }

    // Query to update the order status to 3 (accepted by the hotel)
    const updateOrderQuery = `
      UPDATE orders 
      SET orderStatus = 3, confirmedByHotelDateTime = NOW()
      WHERE id = ?
    `;

    db.query(updateOrderQuery, [orderId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating order status', error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Failed to update order. Order may not exist.' });
      }

      res.status(200).json({ message: 'Order accepted by hotel successfully.', orderId });
    });
  });
};

const declineOrderByHotel = (req, res) => {
  const { order_id, hotel_id } = req.params; // Assuming both order_id and laundry_id are passed as URL parameters
  const jwtHotelId = parseInt(req.user.id, 10);

  if (jwtHotelId !== parseInt(hotel_id, 10)) {
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

const addReview = (req, res) => {
  const { order_id, laundry_id } = req.params;
  const { review } = req.body;
  const hotel_id = req.user.id;


  // Validate required fields
  if (!order_id || review === undefined) {
    return res.status(400).json({ message: 'Laundry ID and review are required.' });
  }

  // Check if the hotel has already added a review for this laundry
  const checkReviewQuery = `
    SELECT * FROM orders 
    WHERE id = ? 
  `;

  db.query(checkReviewQuery, [order_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error checking order', error: err });
    }

    if (results[0].hotel_id !== parseInt(hotel_id, 10)) {
      return res.status(403).json({ message: 'You do not have permission to access this resource.' });
    }

    // Insert the new review
    const updateorderReviewQuery = `
    UPDATE orders
    SET review = ?
    WHERE id = ?
  `;

    db.query(updateorderReviewQuery, [review, order_id], (err, result) => {

      if (err) {
        return res.status(500).json({ message: 'Error adding review', error: err });
      }

      const calculateAverageQuery = `
        SELECT AVG(review) AS averageReview
        FROM orders
        WHERE laundry_id = ?
      `;

      db.query(calculateAverageQuery, [laundry_id], (err, avgResults) => {
        if (err) {
          return res.status(500).json({ message: 'Error calculating average review', error: err });
        }

        const averageReview = avgResults[0].averageReview;

        // Update the review column in the laundry table with the new average
        const updateLaundryReviewQuery = `
          UPDATE laundry
          SET rating = ?
          WHERE id = ?
        `;

        db.query(updateLaundryReviewQuery, [averageReview, laundry_id], (err) => {
          if (err) {
            return res.status(500).json({ message: 'Error updating laundry review', error: err });
          }

          // Review added and laundry review updated successfully
          res.status(201).json({
            message: 'Review added successfully, laundry review updated.',
            reviewId: result.insertId,
            averageReview
          });
        });
      });
    });
  });
};

module.exports = {
  getHotelDetailsById,
  getOrdersByHotelId,
  requestOrderToLaundry,
  acceptOrderByHotel,
  declineOrderByHotel,
  addReview
};
