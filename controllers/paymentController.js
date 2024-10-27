const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
  const { orderId, price } = req.body;

  // Convert price to cents and ensure integer
  const amount = parseInt(price * 100); // Convert to cents
  if (isNaN(amount) || amount <= 0) {
    console.error("Invalid amount. Please check the value of price:", price);
    return res.status(400).json({ error: "Invalid price value" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "lkr",
            product_data: {
              name: `Order ${orderId}`,
            },
            unit_amount: amount, 
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: "Failed to create session" });
  }
};
