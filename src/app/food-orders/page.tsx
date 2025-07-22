
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export default function FoodOrdersPage() {
    const { foodOrders, addFoodOrder, storedOrderDetails } = useContext(AppContext);
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

    const renderActiveContent = () => (
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
                <Alert className="mb-8 border-accent/50 bg-accent/10 text-accent-foreground">
                    <Info className="h-4 w-4 !text-accent" />
                    <AlertTitle>Brak aktywnego głosowania</AlertTitle>
                    <AlertDescription>
                        Obecnie nie ma aktywnego głosowania. Możesz utworzyć nowe, aby społeczność wybrała restaurację.
                    </AlertDescription>
                </Alert>
            )}
            
            {activeOrderEvents.length > 0 ? (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold font-headline">Aktywne zamówienia</h2>
                    <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants} initial="hidden" animate="visible">
                        {activeOrderEvents.map(order => (
                            <motion.div key={`active-order-${order.id}`} variants={itemVariants}>
                                <FoodOrderCard order={order} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            ) : (
                 <Alert className="mb-8 border-accent/50 bg-accent/10 text-accent-foreground">
                    <Info className="h-4 w-4 !text-accent" />
                    <AlertTitle>Brak aktywnych zamówień</AlertTitle>
                    <AlertDescription>
                        Możesz utworzyć bezpośrednie zamówienie, jeśli nie ma potrzeby głosowania.
                    </AlertDescription>
                </Alert>
            )}
        </motion.div>
    );

    const renderHistoryContent = () => (
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
    );

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
                        <h1 className="text-3xl font-bold font-headline text-primary">Wydarzenia jedzeniowe</h1>
                        <p className="text-muted-foreground">Organizuj grupowe zamówienia i głosuj na restauracje.</p>
                    </div>
                </div>

                <div className="text-center mb-8">
                     <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
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
                                storedDetails={storedOrderDetails}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="active">Aktywne wydarzenia</TabsTrigger>
                        <TabsTrigger value="history">Historia</TabsTrigger>
                    </TabsList>
                    <div className="mt-6">
                        <AnimatePresence mode="wait">
                           {activeTab === 'active' ? renderActiveContent() : renderHistoryContent()}
                        </AnimatePresence>
                    </div>
                </Tabs>
            </main>
        </motion.div>
    );
}

    
