import { Order } from "@/payload-types";
import { TRPCError } from "@trpc/server";
import type Stripe from "stripe";
import { z } from "zod";
import { getPayloadClient } from "../getPayload";
import { stripe } from "../lib/stripe";
import { privateProcedure, router } from "./trpc";

export const paymentRouter = router({
  createSession: privateProcedure.input(z.object({ productIds: z.array(z.string()) })).mutation(async ({ ctx, input }) => {
    const { user } = ctx;
    const { productIds } = input;

    if (productIds.length === 0) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    const payload = await getPayloadClient();

    const { docs: products } = await payload.find({
      collection: "products",
      where: {
        id: {
          in: productIds,
        },
      },
    });

    const filteredProducts = products.filter((prod) => Boolean(prod.priceId));

    const order = await payload.create({
      collection: "orders",
      data: {
        _isPaid: false,
        products: filteredProducts.map((prod) => prod.id) as string[],
        user: user.id,
      },
    });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    filteredProducts.forEach((product) => {
      line_items.push({
        price: product.priceId! as string,
        quantity: 1,
      });
    });

    line_items.push({
      price: "price_1Q6TPqDV1lkkjYVyjIcXcqC0",
      quantity: 1,
      adjustable_quantity: {
        enabled: false,
      },
    });

    try {
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
        payment_method_types: ["card"],
        mode: "payment",
        metadata: {
          userId: user.id,
          orderId: order.id,
        },
        line_items,
      });

      return { url: stripeSession.url };
    } catch (err) {
      console.error(err);
      return { url: null };
    }
  }),
  pollOrderStatus: privateProcedure
    .input(z.object({ orderId: z.string() }))
    .output(z.object({ isPaid: z.boolean() }))
    .query(async ({ input }) => {
      const { orderId } = input;

      const payload = await getPayloadClient();

      const { docs: orders } = await payload.find({
        collection: "orders",
        where: {
          id: {
            equals: orderId,
          },
        },
      });

      if (!orders.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const [order] = orders as unknown as Order[];

      return { isPaid: order._isPaid };
    }),
});
