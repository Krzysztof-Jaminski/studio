"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn, getOccupancyDetails, MAX_SPOTS } from "@/lib/utils";
import { type Day } from "@/lib/types";
import { Check, X } from "lucide-react";
import { format } from "date-fns";
import { useContext } from "react";
import { AppContext } from "@/contexts/app-context";

type DayCardProps = {
  day: Day;
  bookedCount: number;
  isBookedByUser: boolean;
};

export default function DayCard({ day, bookedCount, isBookedByUser }: DayCardProps) {
  const { toggleReservation } = useContext(AppContext);
  const { date, isToday, isPast } = day;
  const isFull = bookedCount >= MAX_SPOTS;
  const isDisabled = isPast || (isFull && !isBookedByUser);
  const occupancy = getOccupancyDetails(bookedCount);

  return (
    <Card className={cn(
      "flex flex-col transition-all duration-300",
      isDisabled ? "bg-muted/50" : "bg-card",
      isToday && "border-primary border-2 shadow-lg"
    )}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="font-headline">{format(date, "EEEE")}</CardTitle>
          {isToday && <Badge>Today</Badge>}
        </div>
        <CardDescription>{format(date, "MMMM d, yyyy")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <p className="text-sm font-medium">
                {MAX_SPOTS - bookedCount} <span className="text-muted-foreground">spots left</span>
              </p>
              <p className={cn("text-sm font-semibold", occupancy.textColor)}>{occupancy.label}</p>
            </div>
            <Progress value={(bookedCount / MAX_SPOTS) * 100} className="h-2" indicatorClassName={occupancy.color} />
          </div>
          {isBookedByUser && (
            <div className="flex items-center gap-2 text-green-600 bg-green-100 p-2 rounded-md">
                <Check className="h-5 w-5" />
                <p className="font-semibold text-sm">You are booked!</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full transition-all"
          onClick={() => toggleReservation(date)}
          disabled={isDisabled}
          variant={isBookedByUser ? "destructive" : "default"}
        >
          {isBookedByUser ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Cancel Spot
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Reserve Spot
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
