const nodemailer = require('nodemailer');
const db = require('../../config/db'); // Your database connection
const cron = require('node-cron');

// Configure the email service
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'laundromate2024@gmail.com',
    pass: 'koshblgkwpqhicvf',
  },
});

// Function to generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); 
};

// Function to store OTP in the database
const storeOTPInDB = (email, otp) => {
  const query = `
    INSERT INTO otp (email, otp, expires_at) 
    VALUES (?, ?, CURRENT_TIMESTAMP + INTERVAL 2 MINUTE)
  `;
  
  const values = [email, otp];

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

// Function to delete expired OTPs from the database
const deleteExpiredOTPs = () => {
  const query = `
    DELETE FROM otp
    WHERE expires_at < CURRENT_TIMESTAMP
  `;

  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error deleting expired OTPs:', err);
        return reject(err);
      }
      console.log('Expired OTPs deleted:', result.affectedRows);
      resolve(result);
    });
  });
};

// Schedule to run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    await deleteExpiredOTPs();
  } catch (error) {
    console.error('Error running scheduled task:', error);
  }
});

// Send OTP function
const sendOtp = async (req, res) => {
  const { email } = req.body;

  const otp = generateOTP();

  // First, store the OTP in the database
  try {
    await storeOTPInDB(email, otp);
  } catch (error) {
    return res.status(500).json({ message: 'Error saving OTP to database', error });
  }

  const mailOptions = {
    from: 'laundromate2024@gmail.com',
    to: email,
    subject: 'LaundroMate OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: 'Error sending email', error });
    }
    res.status(200).json({ message: 'OTP sent successfully', info });
  });
};

// verify OTP function
const verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  const query = `SELECT * FROM otp WHERE email = ? AND otp = ? AND expires_at > CURRENT_TIMESTAMP`;
  const values = [email, otp];

  db.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error checking OTP', error: err });
    }

    if (results.length > 0) {
      // OTP is valid
      return res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      // OTP is invalid or expired
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
  });
};




module.exports = { sendOtp, deleteExpiredOTPs, verifyOtp };
