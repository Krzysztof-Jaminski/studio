
"use client";

import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/contexts/app-context';
import Header from '@/components/header';
import WeeklyCalendar from '@/components/weekly-calendar';
import WeeklyStatus from '@/components/weekly-status';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import WelcomePage from './welcome/page';

export default function Home() {
  const { user } = useContext(AppContext);

  if (!user) {
    return <WelcomePage />;
  }

  return (
    <motion.div 
        className="min-h-screen text-foreground"
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
            
             <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8"
             >
                <WeeklyCalendar />
            </motion.div>
          </main>
        </>
    </motion.div>
  );
}
