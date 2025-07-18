
"use client";

import { useContext, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppContext } from '@/contexts/app-context';
import type { FoodOrder, OrderItemData } from '@/lib/types';
import { Avatar, AvatarFallback } from './ui/avatar';
import { UserCircle, Link as LinkIcon, Phone, ShoppingCart, Pencil, Trash2, Check, X, ShieldCheck } from 'lucide-react';
import OrderItem from './order-item';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

export default function FoodOrderCard({ order }: { order: FoodOrder }) {
    const { user, allUsers, addOrderItem, togglePaidStatus, toggleOrderState, removeFoodOrder } = useContext(AppContext);
    const [newItem, setNewItem] = useState<{ name: string; details: string; price: string }>({ name: '', details: '', price: '' });
    const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

    if (!user) return null;

    const creator = allUsers.find(u => u.id === order.creatorId);
    const isCreator = user.id === order.creatorId;
    const isAdmin = user.role === 'admin';

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

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex items-start gap-4">
                    {order.imageUrl && (
                         <Image
                            src={order.imageUrl}
                            alt={`${order.companyName} logo`}
                            width={56}
                            height={56}
                            className="rounded-md border object-cover h-14 w-14"
                            data-ai-hint="logo"
                        />
                    )}
                    <div className="flex-1">
                        <CardTitle className="font-headline text-xl">{order.companyName}</CardTitle>
                         {creator && (
                            <CardDescription className="flex items-center gap-2 text-xs">
                                <Avatar className="h-4 w-4">
                                    <AvatarFallback><UserCircle /></AvatarFallback>
                                </Avatar>
                                Created by {creator.name}
                            </CardDescription>
                        )}
                    </div>
                    {!order.isOpen && <Badge variant="destructive">Closed</Badge>}
                </div>
            </CardHeader>

            <CardContent className="flex-grow space-y-4">
                 <ScrollArea className="h-48 pr-4">
                    <div className="space-y-3">
                        {order.orders.map(item => (
                            <OrderItem key={item.id} item={item} orderId={order.id} isCreator={isCreator} isAdmin={isAdmin}/>
                        ))}
                         {order.orders.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-8">No orders yet. Be the first!</p>
                        )}
                    </div>
                </ScrollArea>
                 <Separator />
                <div className="flex justify-between items-center font-bold">
                    <span>Total:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                </div>
            </CardContent>

            <CardFooter className="flex flex-col items-start gap-3">
                <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                    <a href={order.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                        <LinkIcon /> Menu Link
                    </a>
                    <span className="flex items-center gap-1">
                        <Phone /> {order.creatorPhoneNumber}
                    </span>
                </div>

                {order.isOpen && (
                    <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full"><ShoppingCart className="mr-2" /> Add Your Order</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add to "{order.companyName}" Order</DialogTitle>
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
                                <Button type="submit" className="w-full">Add Order Item</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
                
                {(isCreator || isAdmin) && (
                     <div className="w-full space-y-2 pt-2 border-t">
                        <p className="text-xs font-semibold text-muted-foreground">Creator Actions</p>
                        <div className="flex gap-2">
                             <Button variant="secondary" className="flex-1" onClick={() => togglePaidStatus(order.id, 'all')}>
                                <Check className="mr-2" /> Mark All Paid
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={() => toggleOrderState(order.id)}>
                                {order.isOpen ? <X className="mr-2"/> : <Check className="mr-2" />}
                                {order.isOpen ? "Close Order" : "Re-open Order"}
                            </Button>
                        </div>
                     </div>
                )}
                {isAdmin && (
                    <div className="w-full space-y-2 pt-2 border-t border-dashed border-red-500">
                        <p className="text-xs font-semibold text-red-500 flex items-center gap-1"><ShieldCheck /> Admin Actions</p>
                        <Button variant="destructive" className="w-full" onClick={() => removeFoodOrder(order.id)}>
                            <Trash2 className="mr-2" /> Delete Entire Event
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
