
"use client";

import { useState, useEffect, useContext } from 'react';
import { addDays, startOfWeek, isToday, isBefore, format, startOfToday, isWithinInterval, eachDayOfInterval, getMonth, setMonth } from 'date-fns';
import { AppContext } from '@/contexts/app-context';
import DayCard from './day-card';
import { type Day, type User } from '@/lib/types';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// Define the reservation period
const RESERVATION_START_DATE = new Date('2025-07-07');
const RESERVATION_END_DATE = new Date('2025-10-01');

const months = [
    { label: "July", value: 6 },
    { label: "August", value: 7 },
    { label: "September", value: 8 },
    { label: "October", value: 9 },
]

export default function WeeklyCalendar() {
  const [displayedDays, setDisplayedDays] = useState<Day[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const { user, reservations, allUsers } = useContext(AppContext);

  useEffect(() => {
    // Ensure the initial view is within the allowed range
    const today = new Date();
    const initialDate = isWithinInterval(today, { start: RESERVATION_START_DATE, end: RESERVATION_END_DATE }) 
        ? today 
        : RESERVATION_START_DATE;
    setCurrentDate(initialDate);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const days: Day[] = [];
    for (let i = 0; i < 5; i++) { // Monday to Friday
      const date = addDays(start, i);
      days.push({
        date: date,
        isToday: isToday(date),
        isPast: isBefore(date, startOfToday()),
      });
    }
    setDisplayedDays(days);
    setIsLoading(false);
  }, [currentDate]);

  const getUserDetails = (userIds: string[]): User[] => {
    return userIds.map(id => allUsers.find(u => u.id === id)).filter(Boolean) as User[];
  }
  
  const isDateReservable = (date: Date): boolean => {
    return isWithinInterval(date, { start: RESERVATION_START_DATE, end: RESERVATION_END_DATE });
  }
  
  const changeWeek = (direction: 'prev' | 'next') => {
      const newDate = addDays(currentDate, direction === 'prev' ? -7 : 7);
      // Allow navigation slightly outside the edges to see full weeks
      const navStartDate = startOfWeek(RESERVATION_START_DATE, { weekStartsOn: 1 });
      const navEndDate = addDays(RESERVATION_END_DATE, 7);

      if (isWithinInterval(newDate, { start: navStartDate, end: navEndDate})) {
          setCurrentDate(newDate);
      }
  };

  const handleMonthChange = (monthValue: string) => {
      const monthIndex = parseInt(monthValue, 10);
      const year = RESERVATION_START_DATE.getFullYear();
      let newDate = setMonth(new Date(year, 0, 1), monthIndex);
      
      const today = new Date();
      // If the selected month is the current month and it's within the valid range, jump to today.
      if (getMonth(today) === monthIndex && isWithinInterval(today, { start: RESERVATION_START_DATE, end: RESERVATION_END_DATE })) {
          newDate = today;
      } else {
        // Otherwise, jump to the first day of the selected month.
        if (isBefore(newDate, RESERVATION_START_DATE)) {
            newDate = RESERVATION_START_DATE;
        }
      }
      setCurrentDate(newDate);
  }

  if (isLoading || !user) {
    return (
        <div className="flex justify-center items-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold font-headline">Reservations</h1>
                <p className="text-muted-foreground">Declare your presence for any week within the internship period.</p>
            </div>
            <div className="flex items-center gap-2">
                <Select value={getMonth(currentDate).toString()} onValueChange={handleMonthChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map(m => <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={() => changeWeek('prev')}><ChevronLeft/></Button>
                <Button variant="outline" size="icon" onClick={() => changeWeek('next')}><ChevronRight/></Button>
            </div>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {displayedDays.map((day) => {
          const reservation = reservations.find(r => r.date === format(day.date, "yyyy-MM-dd"));
          const officeUsers = reservation ? getUserDetails(reservation.office) : [];
          const onlineUsers = reservation ? getUserDetails(reservation.online) : [];
          const reservable = isDateReservable(day.date) && !isBefore(day.date, startOfToday());

          let isBookedByUser: 'office' | 'online' | null = null;
          if(reservation) {
            if(reservation.office.includes(user.id)) isBookedByUser = 'office';
            else if (reservation.online.includes(user.id)) isBookedByUser = 'online';
          }

          return (
            <DayCard
              key={day.date.toString()}
              day={day}
              officeUsers={officeUsers}
              onlineUsers={onlineUsers}
              isBookedByUser={isBookedByUser}
              isReservable={reservable}
            />
          );
        })}
      </div>
    </div>
  );
}
