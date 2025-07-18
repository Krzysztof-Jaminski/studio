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
import { format, parseISO } from "date-fns";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { CalendarCheck, LogOut } from "lucide-react";
import { Separator } from "./ui/separator";
import PortfolioSection from "./portfolio-section";

export default function UserProfile() {
  const { user, logout, getUserReservations } = useContext(AppContext);

  if (!user) return null;

  const userReservations = getUserReservations(user.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user.name}`} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[650px] flex flex-col">
        <SheetHeader className="text-left">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user.name}`} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="font-headline text-2xl">{user.name}</SheetTitle>
              <SheetDescription>{user.email}</SheetDescription>
            </div>
          </div>
        </SheetHeader>
        
        <ScrollArea className="flex-grow pr-6 -mr-6 my-4">
            <PortfolioSection />
            <Separator className="my-6" />
            <div className="space-y-4">
                <h3 className="text-lg font-semibold font-headline">Your Reservations</h3>
                {userReservations.length > 0 ? (
                <ul className="space-y-3">
                    {userReservations.map((res) => (
                    <li key={res.date} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                        <p className="font-medium">{format(parseISO(res.date), "EEEE, MMMM d")}</p>
                        <p className="text-sm text-muted-foreground">Status: Confirmed</p>
                        </div>
                        <Badge variant={new Date(res.date) < new Date() ? "secondary" : "default"}>
                            {new Date(res.date) < new Date() ? "Attended" : "Upcoming"}
                        </Badge>
                    </li>
                    ))}
                </ul>
                ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
                    <CalendarCheck className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 font-medium">No reservations yet</p>
                    <p className="text-sm text-muted-foreground">Book a spot to see it here.</p>
                </div>
                )}
            </div>
        </ScrollArea>

        <div className="mt-auto border-t -mx-6 px-6 pt-4 bg-background">
          <Button variant="outline" className="w-full" onClick={logout}>
            <LogOut className="mr-2"/> Log Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
