const db = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; 


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

            const token = jwt.sign({ id: hotel.id, email: hotel.email }, JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({ message: 'Login successful', token });
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

            const token = jwt.sign({ id: laundry.id, email: laundry.email }, JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({ message: 'Login successful', token });
        });
    });
};

module.exports = { loginHotel, loginLaundry };
