
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

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Food Events</h1>
                        <p className="text-muted-foreground">Organize group food orders and vote for restaurants.</p>
                    </div>
                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2" /> Create Event
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Create a New Food Event</DialogTitle>
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
                        <TabsTrigger value="votings">Votings ({activeVotings.length})</TabsTrigger>
                        <TabsTrigger value="orders">Active Orders ({activeOrders.length})</TabsTrigger>
                        <TabsTrigger value="history">Event History ({closedEvents.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="votings">
                         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                            {activeVotings.length > 0 ? (
                                activeVotings.map(order => <VotingEventCard key={order.id} event={order} />)
                            ) : (
                                <p className="text-muted-foreground col-span-full text-center mt-8">No active votings at the moment.</p>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="orders">
                         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                            {activeOrders.length > 0 ? (
                                activeOrders.map(order => <FoodOrderCard key={order.id} order={order} />)
                            ) : (
                                <p className="text-muted-foreground col-span-full text-center mt-8">No active food orders at the moment.</p>
                            )}
                        </div>
                    </TabsContent>
                     <TabsContent value="history">
                         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                            {closedEvents.length > 0 ? (
                                closedEvents.map(order => 
                                    order.type === 'voting' 
                                    ? <VotingEventCard key={order.id} event={order} />
                                    : <FoodOrderCard key={order.id} order={order} />
                                )
                            ) : (
                                <p className="text-muted-foreground col-span-full text-center mt-8">No past events.</p>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
