import express from "express";
import { Resend } from "resend";
import type Stripe from "stripe";
import { ReceiptEmailHtml } from "./components/emails/ReceiptEmail";
import { getPayloadClient } from "./getPayload";
import { stripe } from "./lib/stripe";
import { Product, User } from "./payload-types";
import { WebhookRequest } from "./server";

const resend = new Resend(process.env.RESEND_API_KEY);

export const stripeWebhookHandler: express.RequestHandler = async (req: express.Request, res: express.Response): Promise<void> => {
  const webhookRequest = req as unknown as WebhookRequest;
  const body = webhookRequest.rawBody;
  const signature = req.headers["stripe-signature"] || "";

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || "");
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`);

    return;
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (!session?.metadata?.userId || !session?.metadata?.orderId) {
    res.status(400).send(`Webhook Error: No user present in metadata`);

    return;
  }

  if (event.type === "checkout.session.completed") {
    const payload = await getPayloadClient();

    const { docs: users } = await payload.find({
      collection: "users",
      where: {
        id: {
          equals: session.metadata.userId,
        },
      },
    });

    const [user] = users as unknown as User[];

    if (!user) {
      res.status(404).json({ error: "No such user exists." });
      return;
    }

    const { docs: orders } = await payload.find({
      collection: "orders",
      depth: 2,
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    });

    const [order] = orders;

    if (!order) {
      res.status(404).json({ error: "No such order exists." });
      return;
    }

    await payload.update({
      collection: "orders",
      data: {
        _isPaid: true,
      },
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    });

    // send receipt
    try {
      const data = await resend.emails.send({
        from: "UIKitCorner <arun@pyzalabs.com>",
        to: [user.email],
        subject: "Thanks for your order! This is your receipt.",
        html: await ReceiptEmailHtml({
          date: new Date(),
          email: user.email,
          orderId: session.metadata.orderId,
          products: order.products as Product[],
        }),
      });
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  res.status(200).send();

  return;
};
