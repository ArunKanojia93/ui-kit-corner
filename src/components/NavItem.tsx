"use client";

import { PRODUCT_CATEGORIES } from "@/config";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

type Category = (typeof PRODUCT_CATEGORIES)[number];

interface NavItemProps {
  category: Category;
  handleOpen: () => void;
  isOpen: boolean;
  isAnyOpen: boolean;
}

const NavItem = ({ category, handleOpen, isOpen, isAnyOpen }: NavItemProps) => {
  return (
    <div className="flex">
      <div className="relative flex items-center">
        <Button variant={isOpen ? "default" : "ghost"} onClick={handleOpen} className="gap-1.5">
          {category.label}
          <ChevronDown
            className={cn("h-4 w-4 transition-all text-muted-foreground", {
              "rotate-180 text-white": isOpen,
            })}
          />
        </Button>
      </div>

      {isOpen ? (
        <div
          className={cn("absolute top-full inset-x-0 text-sm text-muted-foreground", {
            "animate-in fade-in-10 slide-in-from-top-5": !isAnyOpen,
          })}
        >
          <div className="absolute inset-0 top-1/2 bg-background shadow" aria-hidden="true" />

          <div className="relateive bg-background">
            <div className="mx-auto max-w-7xl px-8">
              <div className="grid grid-cols-4 gap-x-8 gap-y-10 py-16">
                <div className="col-span-4 col-start-1 grid grid-cols-3 gap-x-8">
                  {category.featured.map((item) => (
                    <div key={item.name} className="group relative text-base sm:text-sm">
                      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted-foreground group-hover:opacity-75">
                        <Image src={item.imageSrc} alt={item.name} fill className="object-cover object-center" />
                      </div>

                      <Link href={item.href} className="mt-6 block font-medium text-primary">
                        {item.name}
                      </Link>

                      <p className="mt-1" aria-hidden="true">
                        Shop now
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NavItem;
