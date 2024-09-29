import dotenv from "dotenv";
import nodemailer from "nodemailer";
import path from "path";
import payload, { Payload } from "payload";
import { InitOptions } from "payload/config";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 465,
  secure: true,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY,
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached = (global as any).payload;

if (!cached) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cached = (global as any).payload = {
    client: null,
    promise: null,
  };
}

interface Args {
  initOptions?: Partial<InitOptions>;
}

export const getPayloadClient = async ({ initOptions }: Args = {}): Promise<Payload> => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET is missing.");
  }

  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    cached.promise = payload.init({
      email: {
        transport: transporter,
        fromName: "UIKitCorner",
        fromAddress: "onboarding@resend.dev",
      },
      secret: process.env.PAYLOAD_SECRET,
      local: !initOptions?.express,
      ...(initOptions || {}),
    });
  }

  try {
    cached.client = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.client;
};
