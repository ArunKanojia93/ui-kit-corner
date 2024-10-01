"use client";

import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CartItem from "./CartItem";
import { buttonVariants } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

const fee = 1;

const Cart = () => {
  const { items } = useCart();

  const total = items.reduce((acc, item) => acc + item.product.price, 0);
  return (
    <Sheet>
      <SheetTrigger className="group -m-2 flex items-center p-2">
        <ShoppingBag aria-hidden="true" className="h-6 w-6 flex-shrink-0 text-foreground group-hover:text-primary" />

        <span className="ml-2 text-sm font-medium text-foreground group-hover:text-primary">{items.length}</span>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col pr-0 sm:mx-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Cart ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length > 0 ? (
          <>
            <ScrollArea>
              <div className="w-full flex flex-col pr-6">
                {items.map(({ product }, i) => (
                  <CartItem key={`cart-item-${i}`} product={product} />
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Transaction Fee</span>
                  <span>{formatPrice(fee)}</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <SheetFooter>
                <SheetTrigger asChild>
                  <Link href="/cart" className={buttonVariants({ className: "w-full" })}>
                    Continue to Checkout
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <div aria-hidden="true" className="relative mb-4 h-60 w-60 text-muted-foreground">
              <Image src="/mascot-2.png" alt="empty-cart" fill />
            </div>
            <div className="text-xl font-semibold">Your cart is empty</div>

            <SheetTrigger asChild>
              <Link href="/products" className={buttonVariants({ variant: "link", className: "", size: "sm" })}>
                Add items to your cart to checkout
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
