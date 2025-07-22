
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, getOccupancyDetails, MAX_SPOTS } from "@/lib/utils";
import type { Day, User } from "@/lib/types";
import { Briefcase, Check, Globe, Users, X } from "lucide-react";
import { format, isWithinInterval } from "date-fns";
import { pl } from 'date-fns/locale';
import { useContext } from "react";
import { AppContext } from "@/contexts/app-context";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserCircle } from "lucide-react";

type DayCardProps = {
  day: Day;
  officeUsers: User[];
  onlineUsers: User[];
  isBookedByUser: 'office' | 'online' | null;
  isReservable: boolean;
};

const UserList = ({ users }: { users: User[] }) => (
    <div className="space-y-2">
        {users.length > 0 ? users.map(user => (
            <div key={user.id} className="flex items-center gap-2 text-sm">
                <Avatar className="h-6 w-6">
                    {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : <AvatarFallback className="text-muted-foreground text-xs"><UserCircle /></AvatarFallback>}
                </Avatar>
                <span>{user.name}</span>
            </div>
        )) : <p className="text-xs text-muted-foreground">No one yet.</p>}
    </div>
);


export default function DayCard({ day, officeUsers, onlineUsers, isBookedByUser, isReservable }: DayCardProps) {
  const { toggleReservation } = useContext(AppContext);
  const { date, isToday } = day;
  
  const bookedInOffice = officeUsers.length;
  const isOfficeFull = bookedInOffice >= MAX_SPOTS;
  
  const isPast = !isReservable && day.isPast;

  const handleCancel = () => {
    if (isBookedByUser) {
        toggleReservation(date, isBookedByUser);
    }
  }

  return (
    <Card className={cn(
      "flex flex-col transition-all duration-300 bg-card",
      isPast || !isReservable ? "opacity-50" : "hover:border-primary/80",
      isToday && isReservable && "border-primary border-2 shadow-lg"
    )}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="font-headline text-primary">{format(date, "EEEE", { locale: pl })}</CardTitle>
          {isToday && isReservable && <Badge variant="default" className="bg-primary/20 text-primary">Today</Badge>}
          {!isReservable && !isPast && <Badge variant="outline">Unavailable</Badge>}
        </div>
        <CardDescription>{format(date, "d MMMM yyyy", { locale: pl })}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow space-y-4">
        {isBookedByUser && (
            <Badge 
                variant={isBookedByUser === 'office' ? 'default' : 'secondary'} 
                className={cn(
                    "w-full justify-center text-white",
                    isBookedByUser === 'office' ? 'bg-primary hover:bg-primary/90' : 'bg-green-600 hover:bg-green-700'
                )}
            >
                {isBookedByUser === 'office' ? <Briefcase className="mr-2"/> : <Globe className="mr-2"/>}
                You are booked {isBookedByUser === 'office' ? 'for the office' : 'for online'}
            </Badge>
        )}

        <div className="space-y-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                        <Briefcase className="mr-2 text-primary" /> 
                        In Office ({bookedInOffice}/{MAX_SPOTS})
                        <Users className="ml-auto" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                    <p className="font-semibold mb-2 text-sm">In Office</p>
                    <UserList users={officeUsers} />
                </PopoverContent>
            </Popover>

            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                        <Globe className="mr-2 text-green-500" /> 
                        Online ({onlineUsers.length})
                        <Users className="ml-auto" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                    <p className="font-semibold mb-2 text-sm">Online</p>
                    <UserList users={onlineUsers} />
                </PopoverContent>
            </Popover>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        {isBookedByUser ? (
            <Button
                className="w-full"
                variant="outline"
                onClick={handleCancel}
                disabled={isPast || !isReservable}
            >
                <X className="mr-2"/> Cancel Reservation
            </Button>
        ) : (
            <>
                <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => toggleReservation(date, 'office')}
                    disabled={isPast || !isReservable || isOfficeFull}
                >
                    <Briefcase className="mr-2" /> Book Office Spot
                </Button>
                <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => toggleReservation(date, 'online')}
                    disabled={isPast || !isReservable}
                >
                    <Globe className="mr-2" /> Book Online
                </Button>
            </>
        )}
      </CardFooter>
    </Card>
  );
}
