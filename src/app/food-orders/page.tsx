
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
import { Utensils, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export default function FoodOrdersPage() {
    const { foodOrders, addFoodOrder } = useContext(AppContext);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('active');

    const handleFormSubmit = (order: Omit<FoodOrder, 'id' | 'creatorId' | 'orders' | 'isOpen' | 'votingOptions'> & { votingOptions?: { name: string, link?: string, imageUrl?: string }[] }) => {
        addFoodOrder(order);
        setIsFormOpen(false);
    };

    const activeVotingEvent = useMemo(() => foodOrders.find(order => order.type === 'voting' && order.isOpen), [foodOrders]);
    const activeOrderEvents = useMemo(() => foodOrders.filter(order => order.type === 'order' && order.isOpen), [foodOrders]);
    
    const historicEvents = useMemo(() => foodOrders.filter(order => !order.isOpen), [foodOrders]);
    const historicVotings = historicEvents.filter(o => o.type === 'voting');
    const historicOrders = historicEvents.filter(o => o.type === 'order');


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
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="active">Aktywne wydarzenia</TabsTrigger>
                        <TabsTrigger value="history">Historia</TabsTrigger>
                    </TabsList>

                    <AnimatePresence mode="wait">
                        <TabsContent value="active" asChild>
                            <motion.div
                                key="active"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                {activeVotingEvent ? (
                                    <VotingEventCard event={activeVotingEvent} />
                                ) : (
                                    <Alert className="mb-8 border-orange-200 bg-orange-50 text-orange-900">
                                        <Info className="h-4 w-4 !text-orange-500" />
                                        <AlertTitle>Brak aktywnego głosowania</AlertTitle>
                                        <AlertDescription>
                                            Obecnie nie ma aktywnego głosowania. Możesz utworzyć nowe, aby społeczność mogła wybrać restaurację.
                                        </AlertDescription>
                                    </Alert>
                                )}
                                
                                {activeOrderEvents.length > 0 ? (
                                    <div className="space-y-4">
                                        <h2 className="text-2xl font-bold font-headline">Aktywne zamówienia</h2>
                                        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants} initial="hidden" animate="visible">
                                            {activeOrderEvents.map(order => (
                                                <motion.div key={order.id} variants={itemVariants}>
                                                    <FoodOrderCard order={order} />
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </div>
                                ) : (
                                     <Alert className="mb-8 border-orange-200 bg-orange-50 text-orange-900">
                                        <Info className="h-4 w-4 !text-orange-500" />
                                        <AlertTitle>Brak aktywnych zamówień</AlertTitle>
                                        <AlertDescription>
                                            Możesz utworzyć bezpośrednie zamówienie, jeśli nie ma potrzeby głosowania.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </motion.div>
                        </TabsContent>

                         <TabsContent value="history" asChild>
                            <motion.div
                                key="history"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold font-headline">Zakończone głosowania</h2>
                                    {historicVotings.length > 0 ? (
                                        <motion.div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6" variants={containerVariants} initial="hidden" animate="visible">
                                            {historicVotings.map(event => (
                                                <motion.div key={`hist-vote-${event.id}`} variants={itemVariants}>
                                                    <VotingEventCard event={event} />
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Brak zakończonych głosowań.</p>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold font-headline">Zakończone zamówienia</h2>
                                    {historicOrders.length > 0 ? (
                                        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants} initial="hidden" animate="visible">
                                            {historicOrders.map(order => (
                                                 <motion.div key={`hist-order-${order.id}`} variants={itemVariants}>
                                                    <FoodOrderCard order={order} />
                                                 </motion.div>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Brak zakończonych zamówień.</p>
                                    )}
                                </div>
                            </motion.div>
                        </TabsContent>
                    </AnimatePresence>
                </Tabs>
            </main>
        </motion.div>
    );
}
