"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, getOccupancyDetails, MAX_SPOTS } from "@/lib/utils";
import type { Day, User } from "@/lib/types";
import { Briefcase, Check, Globe, Users, X } from "lucide-react";
import { format } from "date-fns";
import { useContext } from "react";
import { AppContext } from "@/contexts/app-context";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { UserCircle } from "lucide-react";

type DayCardProps = {
  day: Day;
  officeUsers: User[];
  onlineUsers: User[];
  isBookedByUser: 'office' | 'online' | null;
};

const UserList = ({ users }: { users: User[] }) => (
    <div className="space-y-2">
        {users.length > 0 ? users.map(user => (
            <div key={user.id} className="flex items-center gap-2 text-sm">
                <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-muted-foreground text-xs">
                        <UserCircle />
                    </AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
            </div>
        )) : <p className="text-xs text-muted-foreground">No one yet.</p>}
    </div>
);


export default function DayCard({ day, officeUsers, onlineUsers, isBookedByUser }: DayCardProps) {
  const { toggleReservation, allUsers } = useContext(AppContext);
  const { date, isToday, isPast } = day;
  
  const bookedInOffice = officeUsers.length;
  const isOfficeFull = bookedInOffice >= MAX_SPOTS;
  
  const occupancy = getOccupancyDetails(bookedInOffice);

  const handleCancel = () => {
    if (isBookedByUser) {
        toggleReservation(date, isBookedByUser);
    }
  }

  return (
    <Card className={cn(
      "flex flex-col transition-all duration-300",
      isPast ? "bg-muted/50" : "bg-card",
      isToday && "border-primary border-2 shadow-lg"
    )}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="font-headline">{format(date, "EEEE")}</CardTitle>
          {isToday && <Badge>Today</Badge>}
        </div>
        <CardDescription>{format(date, "MMMM d, yyyy")}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow space-y-4">
        {isBookedByUser && (
            <Badge variant={isBookedByUser === 'office' ? 'default' : 'secondary'} className="w-full justify-center">
                {isBookedByUser === 'office' ? <Briefcase className="mr-2"/> : <Globe className="mr-2"/>}
                You are booked {isBookedByUser}
            </Badge>
        )}

        {/* Attendance Lists */}
        <div className="space-y-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                        <Briefcase className="mr-2" /> 
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
                        <Globe className="mr-2" /> 
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
                variant="destructive"
                onClick={handleCancel}
                disabled={isPast}
            >
                <X className="mr-2"/> Cancel Booking
            </Button>
        ) : (
            <>
                <Button
                    className="w-full"
                    onClick={() => toggleReservation(date, 'office')}
                    disabled={isPast || isOfficeFull}
                >
                    <Briefcase className="mr-2" /> Book Office Spot
                </Button>
                <Button
                    className="w-full"
                    variant="secondary"
                    onClick={() => toggleReservation(date, 'online')}
                    disabled={isPast}
                >
                    <Globe className="mr-2" /> Book Online
                </Button>
            </>
        )}
      </CardFooter>
    </Card>
  );
}
