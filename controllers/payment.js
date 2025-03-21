// backend/controllers/payment.js
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_KEY);

export const getSessionStatus = async (req, res) => {
  const { session_id } = req.query;

  try {
    // Fetch the session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Send the session status back to the frontend
    res.json({ status: session.payment_status });
  } catch (error) {
    console.error("Error retrieving session status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createPayment = async (req, res) => {
  const { currency = "inr", total } = req.body;
  const amount = Math.round(Number(total) * 100);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
