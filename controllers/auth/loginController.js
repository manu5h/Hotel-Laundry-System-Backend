const db = require('../../config/db');
const bcrypt = require('bcrypt');

const loginHotel = (req, res) => {
    const { email, password } = req.body; 

    // Query to get user data based on email
    const query = 'SELECT * FROM hotel WHERE email = ?';
    
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        // Check if any user is found
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const hotel = results[0]; // Get the first user result

        // Compare the provided password with the hashed password in the database
        bcrypt.compare(password, hotel.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords' });
            }
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // If the password matches, return success message or token
            return res.status(200).json({ message: 'Login successful', hotel });
        });
    });
};

const loginLaundry = (req, res) => {
    const { email, password } = req.body; 

    // Query to get user data based on email
    const query = 'SELECT * FROM laundry WHERE email = ?';
    
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        // Check if any user is found
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const laundry = results[0]; // Get the first user result

        // Compare the provided password with the hashed password in the database
        bcrypt.compare(password, laundry.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords' });
            }
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // If the password matches, return success message or token
            return res.status(200).json({ message: 'Login successful', laundry });
        });
    });
};

const loginDeliveryRiders = (req, res) => {
    const { email } = req.body; 

    // Query to get user data based on email
    const query = 'SELECT * FROM deliveryRiders WHERE email = ?';
    
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        // Check if any user is found
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email' });
        }
        const deliveryRiders = results[0]; // Get the first user result

        return res.status(200).json({ message: 'Login successful', deliveryRiders });

    });
};

module.exports = { loginHotel, loginLaundry, loginDeliveryRiders };
