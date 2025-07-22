
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from 'framer-motion';


export default function FoodOrdersPage() {
    const { foodOrders, addFoodOrder } = useContext(AppContext);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleFormSubmit = (order: Omit<FoodOrder, 'id' | 'creatorId' | 'orders' | 'isOpen' | 'votingOptions'>) => {
        addFoodOrder(order);
        setIsFormOpen(false);
    };
    
    const activeVotings = foodOrders.filter(order => order.type === 'voting' && order.isOpen);
    const activeOrders = foodOrders.filter(order => order.type === 'order' && order.isOpen);
    const closedEvents = foodOrders.filter(order => !order.isOpen);

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
            className="min-h-screen bg-background text-foreground"
        >
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
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
                
                <Tabs defaultValue="votings" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="votings">Głosowania ({activeVotings.length})</TabsTrigger>
                        <TabsTrigger value="orders">Aktywne zamówienia ({activeOrders.length})</TabsTrigger>
                        <TabsTrigger value="history">Historia wydarzeń ({closedEvents.length})</TabsTrigger>
                    </TabsList>

                    <AnimatePresence mode="wait">
                        <TabsContent value="votings" asChild>
                             <motion.div 
                                key="votings"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6"
                             >
                                {activeVotings.length > 0 ? (
                                    activeVotings.map(order => <motion.div variants={itemVariants} key={order.id}><VotingEventCard event={order} /></motion.div>)
                                ) : (
                                    <p className="text-muted-foreground col-span-full text-center mt-8">Brak aktywnych głosowań.</p>
                                )}
                            </motion.div>
                        </TabsContent>
                        <TabsContent value="orders" asChild>
                             <motion.div 
                                key="orders"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6"
                             >
                                {activeOrders.length > 0 ? (
                                    activeOrders.map(order => <motion.div variants={itemVariants} key={order.id}><FoodOrderCard order={order} /></motion.div>)
                                ) : (
                                    <p className="text-muted-foreground col-span-full text-center mt-8">Brak aktywnych zamówień.</p>
                                )}
                            </motion.div>
                        </TabsContent>
                         <TabsContent value="history" asChild>
                             <motion.div 
                                key="history"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6"
                             >
                                {closedEvents.length > 0 ? (
                                    closedEvents.map(order => 
                                        <motion.div variants={itemVariants} key={order.id}>
                                            {order.type === 'voting' 
                                            ? <VotingEventCard event={order} />
                                            : <FoodOrderCard order={order} />}
                                        </motion.div>
                                    )
                                ) : (
                                    <p className="text-muted-foreground col-span-full text-center mt-8">Brak zakończonych wydarzeń.</p>
                                )}
                            </motion.div>
                        </TabsContent>
                    </AnimatePresence>
                </Tabs>
            </main>
        </motion.div>
    );
}
