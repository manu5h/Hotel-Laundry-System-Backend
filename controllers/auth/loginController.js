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

        const result = results[0]; // Get the first user result

        // Compare the provided password with the hashed password in the database
        bcrypt.compare(password, result.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords' });
            }
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const token = jwt.sign({ id: result.id, email: result.email }, JWT_SECRET, { expiresIn: '6h' });

            return res.status(200).json({ message: 'Login successful', token, result });
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

        const result = results[0]; // Get the first user result

        // Compare the provided password with the hashed password in the database
        bcrypt.compare(password, result.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords' });
            }
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const token = jwt.sign({ id: result.id, email: result.email }, JWT_SECRET, { expiresIn: '6h' });

            return res.status(200).json({ message: 'Login successful', token, result });
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
        const result = results[0]; // Get the first user result

        const token = jwt.sign({ id: result.id, email: result.email }, JWT_SECRET, { expiresIn: '6h' });

        return res.status(200).json({ message: 'Login successful', token, result });

    });
};

module.exports = { loginHotel, loginLaundry, loginDeliveryRiders };
