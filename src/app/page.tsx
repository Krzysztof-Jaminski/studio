"use client";

import { useContext } from 'react';
import { AppContext } from '@/contexts/app-context';
import Login from '@/components/login';
import Header from '@/components/header';
import WeeklyCalendar from '@/components/weekly-calendar';
import WeeklyStatus from '@/components/weekly-status';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const { user } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {user ? (
        <>
          <Header />
          <main className="container mx-auto px-4 py-8">
            <WeeklyStatus />
            <Separator className="my-8" />
            <WeeklyCalendar />
          </main>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}
