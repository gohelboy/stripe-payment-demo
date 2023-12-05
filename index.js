const express = require("express");
const cors = require("cors");
const app = express();

const stripe = require("stripe")("sk_test_51NQSwQSDGsKHxz6UcMp9Boa4HA0ApNujXADhQ89ONhp3NWuVQNRjyouCq4Gnyd6wXfIFiBXrOaqZux8mDncHpzGs000Tdtfb10");
const base_url_frontend = "https://stripe-shop-demo.netlify.app"
app.use(express.json());
app.use(cors());

app.post("/api/create-checkout-session", async (req, res) => {
  const { product } = req.body;
  if (!product) return res.json({ message: "Please pass required parameter" });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: product.price * 100,
        },
        quantity: product.quantity,
      },
    ],
    mode: "payment",
    success_url: `${base_url_frontend}/confirm`,
    cancel_url: `${base_url_frontend}/cancel`,
  });
  res.json({ id: session.id, url: session.url });
});

app.get("/api", (req, res) => {
  res.json({
    message: "Server is listening..",
  });
});

app.listen(5000, () => { console.log("listening on port 5000"); });
