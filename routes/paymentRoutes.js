const express = require("express");
const { createCheckoutSession, handleStripeWebhook } = require("../controllers/paymentController");

const router = express.Router();

// Route to create a Stripe checkout session
router.post("/create-checkout-session", createCheckoutSession);

// Optionally, if you want to handle webhooks in the future
// router.post("/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

module.exports = router;
