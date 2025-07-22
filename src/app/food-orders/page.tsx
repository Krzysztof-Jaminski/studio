
"use client";

import { useState, useContext } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AppContext } from '@/contexts/app-context';
import FoodOrderForm from '@/components/food-order-form';
import type { FoodOrder } from '@/lib/types';
import FoodOrderCard from '@/components/food-order-card';
import VotingEventCard from '@/components/voting-event-card';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Utensils } from 'lucide-react';


export default function FoodOrdersPage() {
    const { foodOrders, addFoodOrder } = useContext(AppContext);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleFormSubmit = (order: Omit<FoodOrder, 'id' | 'creatorId' | 'orders' | 'isOpen' | 'votingOptions'>) => {
        addFoodOrder(order);
        setIsFormOpen(false);
    };
    
    // For this new design, we assume one active event per day.
    // We'll find the most recent active event to display.
    const activeEvent = foodOrders.find(order => order.isOpen);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-background text-foreground flex flex-col"
        >
            <Header />
            <main className="container mx-auto px-4 py-8 flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Wydarzenia jedzeniowe</h1>
                        <p className="text-muted-foreground">Organizuj grupowe zamówienia i głosuj na restauracje.</p>
                    </div>
                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                                <PlusCircle className="mr-2" /> Utwórz wydarzenie
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Utwórz nowe wydarzenie jedzeniowe</DialogTitle>
                            </DialogHeader>
                            <FoodOrderForm
                                onSubmit={handleFormSubmit}
                                onCancel={() => setIsFormOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
                
                 <Alert className="mb-8 border-orange-200 bg-orange-50 text-orange-900">
                    <Utensils className="h-4 w-4 !text-orange-500" />
                    <AlertTitle>Jak to działa?</AlertTitle>
                    <AlertDescription>
                        Każdego dnia może być aktywne jedno wydarzenie: głosowanie na restaurację lub bezpośrednie zamówienie. Dołącz, dodaj swoje propozycje i bierz udział we wspólnych posiłkach!
                    </AlertDescription>
                </Alert>

                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeEvent ? activeEvent.id : 'no-event'}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="flex-grow flex items-center justify-center"
                    >
                        {activeEvent ? (
                             <div className="w-full h-full max-w-5xl mx-auto">
                                {activeEvent.type === 'voting' 
                                    ? <VotingEventCard event={activeEvent} />
                                    : <FoodOrderCard order={activeEvent} />}
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="text-xl font-semibold text-muted-foreground">Brak aktywnych wydarzeń na dziś.</p>
                                <p className="text-muted-foreground">Może chcesz jakieś utworzyć?</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </motion.div>
    );
}
