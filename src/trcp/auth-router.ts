import { TRPCError } from "@trpc/server";
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
});