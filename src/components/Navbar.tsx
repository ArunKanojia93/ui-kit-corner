import { getServerSideUser } from "@/lib/payload-utils";
import { cookies } from "next/headers";
import Link from "next/link";
import Cart from "./Cart";
import { Icons } from "./Icons";
import MaxWidthWrapper from "./MaxWidthWrapper";
import MobileNav from "./MobileNav";
import NavItems from "./NavItems";
import { buttonVariants } from "./ui/button";
import UserAccountNav from "./UserAccountNav";

const Navbar = async () => {
  const nextCookies = cookies();
  const { user } = await getServerSideUser(nextCookies);

  return (
    <div className="bg-background sticky top-0 inset-x-0 h-16 z-50">
      <header className="relative bg-background">
        <MaxWidthWrapper>
          <div className="border-b border-border">
            <div className="flex h-16 items-center w-full">
              <div className="ml-4 flex lg:ml-0">
                <Link href="/">
                  <Icons.Logo className="h-10 w-10" />
                </Link>
              </div>

              <div className="hidden z-50 lg:ml-8 lg:block lg:self-stretch">
                <NavItems />
              </div>

              <MobileNav />

              <div className="hidden ml-auto lg:flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {user ? null : (
                    <Link href="/sign-in" className={buttonVariants({ variant: "ghost" })}>
                      Sign in
                    </Link>
                  )}

                  {user ? null : <span className="h-6 w-px bg-muted-foreground" aria-hidden="true" />}

                  {user ? (
                    <UserAccountNav user={user} />
                  ) : (
                    <Link href="/sign-up" className={buttonVariants({ variant: "ghost" })}>
                      Create Account
                    </Link>
                  )}

                  {user ? <span className="h-6 w-px bg-muted-foreground" aria-hidden="true" /> : null}

                  {user ? null : (
                    <div className="flex lg:ml-6">
                      <span className="h-6 w-px bg-muted-foreground" aria-hidden="true" />
                    </div>
                  )}

                  <div className="ml-4 flow-root lg:ml-6">
                    <Cart />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;
