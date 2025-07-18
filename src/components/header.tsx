
"use client";

import { useContext } from "react";
import Link from "next/link";
import { AppContext } from "@/contexts/app-context";
import UserProfile from "./user-profile";
import { Logo } from "./icons";
import { Button } from "./ui/button";
import { ShoppingCart, Users } from "lucide-react";

export default function Header() {
  const { user } = useContext(AppContext);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">PraktykanciHub</span>
          </Link>
          {user && (
            <nav className="flex items-center gap-1 text-sm">
                <Link href="/users" className="text-muted-foreground transition-colors hover:text-foreground">
                    <Button variant="ghost">
                        <Users className="mr-2" />
                        Users
                    </Button>
                </Link>
                <Link href="/food-orders" className="text-muted-foreground transition-colors hover:text-foreground">
                    <Button variant="ghost">
                        <ShoppingCart className="mr-2" />
                        Food Orders
                    </Button>
                </Link>
            </nav>
          )}
        </div>
        <div className="flex items-center justify-end space-x-2">
          {user && <UserProfile />}
        </div>
      </div>
    </header>
  );
}
