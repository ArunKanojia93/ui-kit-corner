"use client";

import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AuthValidationSchema, TAuthCredentialsValidation } from "@/lib/validators/accountCredentialsValidator";
import { trpc } from "@/trcp/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidation>({
    resolver: zodResolver(AuthValidationSchema),
  });

  const { mutate } = trpc.auth.createPayloadUser.useMutation({});

  const onSubmit = ({ email, password }: TAuthCredentialsValidation) => {
    mutate({ email, password });
  };

  return (
    <div className="container relative flex flex-col pt-20 items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Icons.Logo className="h-20 w-20" />

          <h1 className="text-2xl font-bold">Create an account</h1>

          <Link href="/sign-in" className={buttonVariants({ variant: "link", className: "gap-1.5" })}>
            Already have an accout? Sign In
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <div className="grid gap-1 py-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  {...register("email")}
                  className={cn({
                    "focus-visble:ring-destructive": errors.email,
                  })}
                  placeholder="you@example.com"
                />
              </div>
              <div className="grid gap-1 py-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  {...register("password")}
                  className={cn({
                    "focus-visble:ring-destructive": errors.password,
                  })}
                  placeholder="********"
                />
              </div>

              <Button>Sign Up</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;