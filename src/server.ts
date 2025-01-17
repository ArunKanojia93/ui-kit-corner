import { CreateExpressContextOptions, createExpressMiddleware } from "@trpc/server/adapters/express";
import bodyParser from "body-parser";
import express from "express";
import { IncomingMessage } from "http";
import nextBuild from "next/dist/build";
import path from "path";
import { getPayloadClient } from "./getPayload";
import { nextApp, nextHandler } from "./next-utils";
import { appRouter } from "./trcp";
import { stripeWebhookHandler } from "./webhooks";

const app = express();

const PORT = Number(process.env.PORT) || 3000;

const createContext = ({ req, res }: CreateExpressContextOptions) => {
  return {
    req,
    res,
  };
};

export type ExpressContext = Awaited<ReturnType<typeof createContext>>;

export type WebhookRequest = IncomingMessage & {
  rawBody: Buffer;
};
const start = async () => {
  const webhookMiddleware = bodyParser.json({
    verify: (req: WebhookRequest, _, buffer) => {
      req.rawBody = buffer;
    },
  });

  app.post("/api/webhooks/stripe", webhookMiddleware, stripeWebhookHandler);

  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`);
      },
    },
  });

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info("Next.js is building for production");

      // await nextBuild(path.join(__dirname, "../"), undefined, undefined, undefined, undefined, undefined, undefined, "default");
      // @ts-expect-error will still work
      await nextBuild(path.join(__dirname, "../"));

      process.exit();
    });

    return;
  }

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  app.use((req, res) => nextHandler(req, res));

  nextApp.prepare().then(() => {
    payload.logger.info(`Listening on ${PORT}`);

    app.listen(PORT, async () => {
      payload.logger.info(`Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`);
    });
  });
};

start();
