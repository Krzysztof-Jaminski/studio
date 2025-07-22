
"use client";

import { useContext, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppContext } from '@/contexts/app-context';
import type { FoodOrder, OrderItemData } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { UserCircle, Link as LinkIcon, Phone, ShoppingCart, Pencil, Trash2, Check, X, ShieldCheck } from 'lucide-react';
import OrderItem from './order-item';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { isPast } from 'date-fns';
import CountdownTimer from './countdown-timer';

export default function FoodOrderCard({ order }: { order: FoodOrder }) {
    const { user, allUsers, addOrderItem, togglePaidStatus, toggleOrderState, removeFoodOrder } = useContext(AppContext);
    const [newItem, setNewItem] = useState<{ name: string; details: string; price: string }>({ name: '', details: '', price: '' });
    const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

    if (!user) return null;

    const creator = allUsers.find(u => u.id === order.creatorId);
    const isCreator = user.id === order.creatorId;
    const isAdmin = user.role === 'admin';
    const isDeadlinePassed = order.deadline ? isPast(new Date(order.deadline)) : false;

    const handleAddOrderItem = (e: React.FormEvent) => {
        e.preventDefault();
        const price = parseFloat(newItem.price);
        if (newItem.name && !isNaN(price)) {
            addOrderItem(order.id, {
                name: newItem.name,
                details: newItem.details,
                price: price,
            });
            setNewItem({ name: '', details: '', price: '' });
            setIsOrderDialogOpen(false);
        }
    };

    const totalAmount = order.orders.reduce((sum, item) => sum + item.price, 0);
    const canOrder = order.isOpen && !isDeadlinePassed;

    return (
        <Card className="flex flex-col border-accent/30 bg-card h-full">
            <CardHeader className="bg-secondary/50 rounded-t-lg p-4">
                <div className="flex items-start gap-4">
                    {order.imageUrl && (
                         <Image
                            src={order.imageUrl}
                            alt={`${order.companyName} logo`}
                            width={56}
                            height={56}
                            className="rounded-md border-2 border-border object-cover h-14 w-14"
                        />
                    )}
                    <div className="flex-1">
                        <CardTitle className="font-headline text-xl text-accent">{order.companyName}</CardTitle>
                         {creator ? (
                            <CardDescription className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Avatar className="h-4 w-4">
                                   {creator.avatarUrl ? <AvatarImage src={creator.avatarUrl} alt={creator.name} /> : <AvatarFallback><UserCircle /></AvatarFallback>}
                                </Avatar>
                                Created by {creator.name}
                            </CardDescription>
                        ) : (
                           <CardDescription className="text-xs text-muted-foreground">Creator not found</CardDescription>
                        )}
                    </div>
                    {!order.isOpen && <Badge variant="destructive" className="bg-red-500/80">Closed</Badge>}
                </div>
                 {order.deadline && <CountdownTimer deadline={order.deadline} />}
            </CardHeader>

            <CardContent className="flex-grow space-y-4 flex flex-col min-h-0 p-4">
                 <ScrollArea className="flex-grow pr-4 -mr-4">
                    <div className="space-y-3">
                        {order.orders.map(item => (
                            <OrderItem key={item.id} item={item} orderId={order.id} isCreator={isCreator} isAdmin={isAdmin}/>
                        ))}
                         {order.orders.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-8">No orders yet. Be the first!</p>
                        )}
                    </div>
                </ScrollArea>
                 <Separator className="mt-auto" />
                <div className="flex justify-between items-center font-bold pt-2">
                    <span>Total:</span>
                    <span>{totalAmount.toFixed(2)} zł</span>
                </div>
            </CardContent>

            <CardFooter className="flex flex-col items-start gap-3 border-t p-4 bg-secondary/30">
                <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                    <a href={order.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-accent transition-colors">
                        <LinkIcon /> Menu Link
                    </a>
                    <span className="flex items-center gap-1">
                        <Phone /> {order.creatorPhoneNumber}
                    </span>
                </div>

                {canOrder ? (
                    <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"><ShoppingCart className="mr-2" /> Add Your Order</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add to order "{order.companyName}"</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAddOrderItem} className="space-y-4">
                                <div>
                                    <Label htmlFor="item-name">Product Name</Label>
                                    <Input id="item-name" value={newItem.name} onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))} required />
                                </div>
                                <div>
                                    <Label htmlFor="item-details">Details (optional)</Label>
                                    <Input id="item-details" value={newItem.details} onChange={e => setNewItem(prev => ({ ...prev, details: e.target.value }))} placeholder="e.g., extra cheese, no onions" />
                                </div>
                                <div>
                                    <Label htmlFor="item-price">Price</Label>
                                    <Input id="item-price" type="number" step="0.01" value={newItem.price} onChange={e => setNewItem(prev => ({ ...prev, price: e.target.value }))} required />
                                </div>
                                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Add Order</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                ) : (
                    <Button className="w-full" disabled>
                        {isDeadlinePassed ? 'Order collection has ended' : 'Event is closed'}
                    </Button>
                )}
                
                {(isCreator || isAdmin) && (
                     <div className="w-full space-y-2 pt-2 border-t">
                        <p className="text-xs font-semibold text-muted-foreground">Creator Actions</p>
                        <div className="flex gap-2">
                             <Button variant="secondary" className="flex-1" onClick={() => togglePaidStatus(order.id, 'all')}>
                                <Check className="mr-2" /> Mark all as paid
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={() => toggleOrderState(order.id)}>
                                {order.isOpen ? <X className="mr-2"/> : <Check className="mr-2" />}
                                {order.isOpen ? "Close Order" : "Reopen Order"}
                            </Button>
                        </div>
                     </div>
                )}
                {isAdmin && (
                    <div className="w-full space-y-2 pt-2 border-t border-dashed border-accent">
                        <p className="text-xs font-semibold text-accent flex items-center gap-1"><ShieldCheck /> Admin Actions</p>
                        <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={() => removeFoodOrder(order.id)}>
                            <Trash2 className="mr-2" /> Delete Entire Event
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
