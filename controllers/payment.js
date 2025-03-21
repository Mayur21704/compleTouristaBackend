// backend/controllers/payment.js
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_KEY);

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
