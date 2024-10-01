import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/ProductReel";
import { Button, buttonVariants } from "@/components/ui/button";
import { BadgeCheck, ShieldCheck, UserRoundCheck } from "lucide-react";
import Link from "next/link";

const perks = [
  {
    name: "Verified Quality",
    icon: ShieldCheck,
    description: "Every asset undergoes rigorous quality checks by our expert team, ensuring you only get or sell the best designs.",
  },
  {
    name: "Streamlined Marketplace",
    icon: UserRoundCheck,
    description: "Our user-friendly platform connects buyers and sellers efficiently, saving time and simplifying transactions for both parties.",
  },
  {
    name: "Community of Professionals",
    icon: BadgeCheck,
    description: "Join a thriving ecosystem of top-tier designers and discerning clients, fostering collaboration and growth in the design industry.",
  },
];

export default function Home() {
  return (
    <>
      <MaxWidthWrapper>
        <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Your marketplace for high-quality <span className="text-primary">digital assets</span>.
          </h1>

          <p className="mt-6 text-lg max-w-prose text-muted-foreground">Discover premium design at UIKitCorner. Every asset in our curated collection is hand-picked and quality-assured by our expert team. Elevate your projects with confidence.</p>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link href="/products" className={buttonVariants()}>
              Browse Trending
            </Link>
            <Button variant="ghost">Our quality promise &rarr;</Button>
          </div>
        </div>

        {/* TODO: List Products */}
        <ProductReel query={{ limit: 4 }} title="Trending Products" href="/products" />
      </MaxWidthWrapper>

      <section className="border-t bg-secondary">
        <MaxWidthWrapper className="py-20">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
            {perks.map((perk) => (
              <div key={perk.name} className="text-center md:flex md:items-start md:text-left lg:block lg:text-center">
                <div className="md:flex-shrink-0 flex justify-center">
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <perk.icon className="w-1/3 h-1/3" />
                  </div>
                </div>

                <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                  <h3 className="font-medium text-accent-foreground">{perk.name}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{perk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
