"use client";

import { useCart } from "@/hooks/use-cart";
import { Product } from "@/payload-types";
import { Button } from "./ui/button";

const AddToCartButton = ({ product }: { product: Product }) => {
  const { addItem, items } = useCart();

  const isAdded = items.some(({ product: item }) => item.id === product.id);

  return (
    <Button
      onClick={() => {
        addItem(product);
      }}
      size="lg"
      className="w-full mt-10"
      disabled={isAdded}
    >
      {isAdded ? "Item added to cart" : "Add to cart"}
    </Button>
  );
};

export default AddToCartButton;
