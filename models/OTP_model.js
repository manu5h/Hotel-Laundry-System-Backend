const db = require('../config/db'); // Your database connection

// Create the OTP table if it doesn't exist
function createOTPTable() {
    const OTPTable = `
    CREATE TABLE IF NOT EXISTS OTP (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL
    );
    `;

    // Execute the query
    db.query(OTPTable, (err, result) => {
        if (err) {
            console.error("Error creating OTP table: ", err);
        }
    });
}

module.exports = createOTPTable;
