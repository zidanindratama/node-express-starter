// publishable  : pk_test_51NcNYeGGXjd0KQoxICXOWfhRGSAzGkfqqenjaZzsgEEHcosX0UI1kotaYN3CtQ6fqRrxbGMPiofsYCC2kzlDgCYa009opV2IaV
// secret       : sk_test_51NcNYeGGXjd0KQoxBp5aanLRpUFkzi1g7EFwJ4ljjqRfMb7kuo1Nzb4WLjZxzF2TaFJ4RT3UUXTtk8ZXlphxnLxp003EnIPlvf
import express from "express";
import cors from "cors";
import morgan from "morgan";
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51NcNYeGGXjd0KQoxBp5aanLRpUFkzi1g7EFwJ4ljjqRfMb7kuo1Nzb4WLjZxzF2TaFJ4RT3UUXTtk8ZXlphxnLxp003EnIPlvf"
);

import * as middleware from "./utils/middleware.js";
import helloRoute from "./routes/helloRouter.js";

const app = express();

// parse json request body
app.use(express.json());

// enable cors
app.use(cors());

// request logger middleware
app.use(morgan("tiny"));

// healthcheck endpoint
app.get("/", (req, res) => {
  res.status(200).send({ status: "ok" });
});

app.use("/hello", helloRoute);

app.post("/checkout", async (req, res) => {
  console.log(req.body);
  const items = req.body.items;
  let lineItems = [];
  items.forEach((item) => {
    lineItems.push({
      price: item.id,
      quantity: item.quantity,
    });
  });

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: "https://mition-website-klinik24-1ia09.netlify.app/success",
    cancel_url: "https://mition-website-klinik24-1ia09.netlify.app/",
  });

  res.send(
    JSON.stringify({
      url: session.url,
    })
  );
});

// custom middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
