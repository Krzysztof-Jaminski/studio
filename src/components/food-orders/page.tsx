
"use client";

import { useState, useContext, useMemo } from 'react';
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
import { Info } from 'lucide-react';

export default function FoodOrdersPage() {
    const { foodOrders, addFoodOrder } = useContext(AppContext);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleFormSubmit = (order: Omit<FoodOrder, 'id' | 'creatorId' | 'orders' | 'isOpen' | 'votingOptions'> & { votingOptions?: { name: string, link?: string, imageUrl?: string }[] }) => {
        addFoodOrder(order);
        setIsFormOpen(false);
    };

    const activeVotingEvent = useMemo(() => foodOrders.find(order => order.type === 'voting' && order.isOpen), [foodOrders]);
    const activeOrderEvents = useMemo(() => foodOrders.filter(order => order.type === 'order' && order.isOpen), [foodOrders]);

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
                        <h1 className="text-3xl font-bold font-headline text-primary">Food Events</h1>
                        <p className="text-muted-foreground">Organize group orders and vote for restaurants.</p>
                    </div>
                </div>

                <div className="text-center mb-8">
                     <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <PlusCircle className="mr-2" /> Create Event
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Create a new food event</DialogTitle>
                            </DialogHeader>
                            <FoodOrderForm
                                onSubmit={handleFormSubmit}
                                onCancel={() => setIsFormOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
                
                <AnimatePresence>
                    <motion.div
                        key="food-orders-content"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
                        {activeVotingEvent ? (
                            <motion.div key={activeVotingEvent.id} layout>
                                <VotingEventCard event={activeVotingEvent} />
                            </motion.div>
                        ) : (
                            !activeOrderEvents.length && (
                                <Alert className="mb-8 border-accent/50 bg-accent/10 text-accent-foreground">
                                    <Info className="h-4 w-4 !text-accent" />
                                    <AlertTitle>No Active Events</AlertTitle>
                                    <AlertDescription>
                                        There are no active voting or order events. You can create one to get started!
                                    </AlertDescription>
                                </Alert>
                            )
                        )}
                        
                        {activeOrderEvents.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold font-headline">Active Orders</h2>
                                <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants} initial="hidden" animate="visible">
                                    {activeOrderEvents.map(order => (
                                        <motion.div key={`active-order-${order.id}`} variants={itemVariants} layout>
                                            <FoodOrderCard order={order} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </motion.div>
    );
}
