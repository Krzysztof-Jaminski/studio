
"use client";

import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/contexts/app-context';
import Login from '@/components/login';
import Header from '@/components/header';
import WeeklyCalendar from '@/components/weekly-calendar';
import WeeklyStatus from '@/components/weekly-status';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import WelcomePage from './welcome/page';

export default function Home() {
  const { user } = useContext(AppContext);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const welcomeSeen = localStorage.getItem('hasSeenWelcome');
    if (!welcomeSeen) {
      setShowWelcome(true);
    }
    setIsLoading(false);
  }, []);

  const handleWelcomeDone = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
  }
  
  if (isLoading) {
    return <div className="min-h-screen bg-background" />; 
  }

  if (showWelcome && !user) {
    return <WelcomePage onDone={handleWelcomeDone} />;
  }
  
  if (!user) {
    return <Login />;
  }

  return (
    <motion.div 
        className="min-h-screen bg-background text-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
        <>
          <Header />
          <main className="container mx-auto px-4 py-8">
             <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
             >
                <WeeklyStatus />
            </motion.div>
            <Separator className="my-8" />
             <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
             >
                <WeeklyCalendar />
            </motion.div>
          </main>
        </>
    </motion.div>
  );
}
