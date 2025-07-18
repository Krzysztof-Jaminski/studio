"use client";

import { useState, useEffect, useContext } from 'react';
import { addDays, startOfWeek, isToday, isBefore, format, startOfToday } from 'date-fns';
import { AppContext } from '@/contexts/app-context';
import DayCard from './day-card';
import { type Day } from '@/lib/types';
import { Button } from './ui/button';
import { MAX_SPOTS } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function WeeklyCalendar() {
  const [weekDays, setWeekDays] = useState<Day[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, reservations, toggleAllReservations } = useContext(AppContext);

  useEffect(() => {
    const today = new Date();
    // Week starts on Monday
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const days: Day[] = [];
    for (let i = 0; i < 5; i++) { // Monday to Friday
      const currentDate = addDays(start, i);
      days.push({
        date: currentDate,
        isToday: isToday(currentDate),
        isPast: isBefore(currentDate, startOfToday()),
      });
    }
    setWeekDays(days);
    setIsLoading(false);
  }, []);

  const handleSelectAll = () => {
    const availableDays = weekDays
        .map(day => {
            const reservation = reservations.find(r => r.date === format(day.date, 'yyyy-MM-dd'));
            const isFull = reservation ? reservation.users.length >= MAX_SPOTS : false;
            return { ...day, isFull };
        })
        .filter(day => !day.isPast && !day.isFull)
        .map(day => day.date);
    
    toggleAllReservations(availableDays);
  };

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
                <h1 className="text-3xl font-bold font-headline">Your Week</h1>
                <p className="text-muted-foreground">Reserve your spot for the upcoming week.</p>
            </div>
            <Button onClick={handleSelectAll}>Select All Available</Button>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {weekDays.map((day) => {
          const reservation = reservations.find(r => r.date === format(day.date, "yyyy-MM-dd"));
          const bookedCount = reservation ? reservation.users.length : 0;
          const isBookedByUser = reservation ? reservation.users.includes(user.id) : false;

          return (
            <DayCard
              key={day.date.toString()}
              day={day}
              bookedCount={bookedCount}
              isBookedByUser={isBookedByUser}
            />
          );
        })}
      </div>
    </div>
  );
}
