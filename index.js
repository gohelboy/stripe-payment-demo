const express = require("express");
const cors = require("cors");
const app = express();

const stripe = require("stripe")(
  "sk_test_51NQSwQSDGsKHxz6UcMp9Boa4HA0ApNujXADhQ89ONhp3NWuVQNRjyouCq4Gnyd6wXfIFiBXrOaqZux8mDncHpzGs000Tdtfb10"
);

app.use(express.json());
app.use(cors());

app.post("/api/create-checkout-session", async (req, res) => {
  const { product } = req.body;
  if (!product) return res.json({ message: "Please pass required parameter" });

  additionalData = {
    test_data: "dwarkesh",
    age: 24,
  };

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
    success_url: `http://localhost:8000/api/confirm-order?data=${encodeURIComponent(
      JSON.stringify(additionalData)
    )}`,
    cancel_url: "https://localhost:/api/failed-order",
  });
  res.json({ id: session.id, url: session.url });
});

app.get("/api/confirm-order", (req, res) => {
  const dataParams = req.query.data;
  const parsedData = JSON.parse(decodeURIComponent(dataParams));
  console.log("store this data", parsedData);
  res.json(parsedData);
});

app.get("/api/", (req, res) => {
  res.json({
    message: "Server is listening..",
  });
});

app.listen(5000, (req, res) => {
  console.log("listening on port 5000");
});
