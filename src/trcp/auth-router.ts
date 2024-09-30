import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getPayloadClient } from "../getPayload";
import { AuthValidationSchema } from "../lib/validators/accountCredentialsValidator";
import { publicProcedure, router } from "./trpc";

export const authRouter = router({
  createPayloadUser: publicProcedure.input(AuthValidationSchema).mutation(async ({ input }) => {
    const { email, password } = input;

    const payload = await getPayloadClient();

    const { docs: users } = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (users.length > 0)
      throw new TRPCError({
        code: "CONFLICT",
        message: "User already exists",
      });

    await payload.create({
      collection: "users",
      data: {
        email,
        password,
        role: "user",
      },
    });

    return {
      success: true,
      sentToEmail: email,
    };
  }),

  login: publicProcedure.input(AuthValidationSchema).mutation(async ({ input, ctx: { res } }) => {
    const { email, password } = input;

    const payload = await getPayloadClient();

    try {
      await payload.login({
        collection: "users",
        data: {
          email,
          password,
        },
        res,
      });

      return {
        success: true,
      };
    } catch (err) {
      console.error(err);
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }
  }),

  verifyEmail: publicProcedure.input(z.object({ token: z.string() })).query(async ({ input }) => {
    const { token } = input;
    const payload = await getPayloadClient();

    const isVerified = await payload.verifyEmail({
      collection: "users",
      token,
    });

    if (!isVerified)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not found",
      });

    return {
      success: true,
    };
  }),
});
