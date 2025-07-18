
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function FoodOrdersPage() {
    const { foodOrders, addFoodOrder } = useContext(AppContext);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleFormSubmit = (order: Omit<FoodOrder, 'id' | 'creatorId' | 'orders' | 'isOpen'>) => {
        addFoodOrder(order);
        setIsFormOpen(false);
    };

    const activeOrders = foodOrders.filter(order => order.isOpen);
    const closedOrders = foodOrders.filter(order => !order.isOpen);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Food Orders</h1>
                        <p className="text-muted-foreground">Organize group food orders with your colleagues.</p>
                    </div>
                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2" /> Create Order
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create a New Food Order</DialogTitle>
                            </DialogHeader>
                            <FoodOrderForm
                                onSubmit={handleFormSubmit}
                                onCancel={() => setIsFormOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
                
                <Tabs defaultValue="active" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="active">Active Orders</TabsTrigger>
                        <TabsTrigger value="closed">Order History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="active">
                         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                            {activeOrders.length > 0 ? (
                                activeOrders.map(order => <FoodOrderCard key={order.id} order={order} />)
                            ) : (
                                <p className="text-muted-foreground col-span-full text-center mt-8">No active food orders at the moment.</p>
                            )}
                        </div>
                    </TabsContent>
                     <TabsContent value="closed">
                         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                            {closedOrders.length > 0 ? (
                                closedOrders.map(order => <FoodOrderCard key={order.id} order={order} />)
                            ) : (
                                <p className="text-muted-foreground col-span-full text-center mt-8">No past food orders.</p>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
