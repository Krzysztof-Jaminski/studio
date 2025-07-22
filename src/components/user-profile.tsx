
"use client";

import { useContext } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppContext } from "@/contexts/app-context";
import { ScrollArea } from "./ui/scroll-area";
import { LogOut, UserCircle } from "lucide-react";
import PortfolioSection from "./portfolio-section";

export default function UserProfile() {
  const { user, logout } = useContext(AppContext);

  if (!user) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
             {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : <AvatarFallback className="text-muted-foreground"><UserCircle className="h-full w-full" /></AvatarFallback> }
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[650px] flex flex-col">
        <SheetHeader className="text-left">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
               {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : <AvatarFallback className="text-muted-foreground"><UserCircle className="h-full w-full" /></AvatarFallback> }
            </Avatar>
            <div>
              <SheetTitle className="font-headline text-2xl">{user.name}</SheetTitle>
              <SheetDescription>{user.email}</SheetDescription>
            </div>
          </div>
        </SheetHeader>
        
        <ScrollArea className="flex-grow pr-6 -mr-6 my-4">
            <PortfolioSection />
        </ScrollArea>

        <div className="mt-auto border-t -mx-6 px-6 pt-4 bg-background">
          <Button variant="outline" className="w-full" onClick={logout}>
            <LogOut className="mr-2"/> Wyloguj
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
