
"use client";

import { useContext } from 'react';
import type { OrderItem, User } from '@/lib/types';
import { AppContext } from '@/contexts/app-context';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Check, Trash2, UserCircle, X, ShieldCheck } from 'lucide-react';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

type OrderItemProps = {
    item: OrderItem;
    orderId: string;
    isCreator: boolean;
    isAdmin: boolean;
};

export default function OrderItem({ item, orderId, isCreator, isAdmin }: OrderItemProps) {
    const { user, allUsers, removeOrderItem, togglePaidStatus } = useContext(AppContext);
    const itemUser = allUsers.find(u => u.id === item.userId);
    const canModify = isCreator || isAdmin || user?.id === item.userId;

    if (!user) return null;

    return (
        <div className={cn(
            "flex items-center gap-3 p-2 rounded-md transition-colors",
            item.isPaid ? 'bg-green-100' : 'bg-card'
        )}>
            <Avatar className="h-8 w-8">
                <AvatarFallback><UserCircle /></AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <p className="font-semibold text-sm">{itemUser?.name || 'Unknown User'}</p>
                    <p className="font-bold text-sm text-orange-700">${item.price.toFixed(2)}</p>
                </div>
                <p className="text-xs text-muted-foreground">{item.name}</p>
                {item.details && <p className="text-xs text-muted-foreground">↳ {item.details}</p>}
            </div>
            
            <div className="flex items-center gap-1">
                 {(isCreator || isAdmin) && (
                    <Button 
                        size="icon" 
                        variant={item.isPaid ? "default" : "outline"} 
                        className={cn(
                            "h-7 w-7",
                            item.isPaid ? "bg-green-500 hover:bg-green-600" : "hover:bg-gray-100"
                        )}
                        onClick={() => togglePaidStatus(orderId, item.id)}
                    >
                        {item.isPaid ? <X /> : <Check />}
                    </Button>
                )}
                 {(canModify || isAdmin) && (
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7 text-muted-foreground hover:bg-orange-100 hover:text-orange-600"
                        onClick={() => removeOrderItem(orderId, item.id)}
                    >
                         {isAdmin && user?.id !== item.userId && <ShieldCheck className="absolute h-3 w-3 -top-1 -right-1 text-orange-500" />}
                        <Trash2 />
                    </Button>
                 )}
            </div>
        </div>
    );
}
