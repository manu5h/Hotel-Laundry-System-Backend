const db = require('../../config/db');

// Add a new clothing item without an order
const createClothingItem = (req, res) => {
  const { 
    hotel_id, 
    category, 
    cleaningType, 
    pressing_ironing, 
    stain_removal, 
    folding, 
    special_instructions 
  } = req.body;

  // Query to insert a clothing item
  const itemQuery = `
    INSERT INTO clothingItems 
    (itemStatus, hotel_id, category, cleaningType, pressing_ironing, stain_removal, folding, special_instructions) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const itemValues = [
    0, // itemStatus
    hotel_id,
    category,
    cleaningType,
    pressing_ironing ? 1 : 0,
    stain_removal ? 1 : 0,
    folding ? 1 : 0,
    special_instructions || null
  ];

  db.query(itemQuery, itemValues, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating clothing item', error: err });
    }
    res.status(201).json({ message: 'Clothing item created successfully', itemId: result.insertId });
  });
};

const getClothingItemsByHotelId = (req, res) => {
  const { hotel_id } = req.params;

  // Ensure that the hotel_id from the JWT matches the hotel_id being requested
  if (req.user.id !== parseInt(hotel_id, 10)) {
      return res.status(403).json({ message: 'You do not have permission to access this resource' });
  }

  // Query to fetch all clothing items by hotel_id
  const query = `
      SELECT * FROM clothingItems 
      WHERE hotel_id = ?
  `;

  db.query(query, [hotel_id], (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'Error fetching clothing items', error: err });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'No clothing items found for this hotel' });
      }

      res.status(200).json({ clothingItems: results });
  });
};



module.exports = { createClothingItem ,getClothingItemsByHotelId};
