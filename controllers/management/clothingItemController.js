const db = require('../../config/db');

// Add a new clothing item without an order
const createClothingItem = (req, res) => {
  const { category, cleaningType, pressing_ironing, stain_removal, folding, special_instructions } = req.body;

  // Query to insert a clothing item
  const itemQuery = `
    INSERT INTO clothingItems 
    (itemStatus, category, cleaningType, pressing_ironing, stain_removal, folding, special_instructions) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const itemValues = [
    0, 
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

module.exports = { createClothingItem };
