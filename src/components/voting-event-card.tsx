
"use client";

import { useContext, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppContext } from '@/contexts/app-context';
import type { FoodOrder, User, VotingOption } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { UserCircle, Check, X, ShieldCheck, Trash2, Trophy, Users, PlusCircle, Link as LinkIcon, Pencil, ShoppingCart, Info } from 'lucide-react';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { isPast } from 'date-fns';
import CountdownTimer from './countdown-timer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import AddOptionForm from './add-option-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

const VoterList = ({ users }: { users: User[] }) => (
    <div className="space-y-2">
        {users.length > 0 ? users.map(user => (
            <div key={user.id} className="flex items-center gap-2 text-sm">
                <Avatar className="h-6 w-6">
                    {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : <AvatarFallback className="text-muted-foreground text-xs"><UserCircle /></AvatarFallback>}
                </Avatar>
                <span>{user.name}</span>
            </div>
        )) : <p className="text-xs text-muted-foreground">Brak głosów.</p>}
    </div>
);

const VotingOptionCard = ({ option, eventId, totalVotes, isWinner, isClosed, canVote }: { option: VotingOption, eventId: string, totalVotes: number, isWinner: boolean, isClosed: boolean, canVote: boolean }) => {
    const { user, allUsers, toggleVote, createOrderFromVote } = useContext(AppContext);
    if (!user) return null;

    const voters = option.votes.map(id => allUsers.find(u => u.id === id)).filter(Boolean) as User[];
    const hasVoted = option.votes.includes(user.id);
    const votePercentage = totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;
    const addedByUser = allUsers.find(u => u.id === option.addedById);


    return (
        <Card className={cn(
            "flex flex-col relative h-full bg-card transition-all",
            hasVoted && "border-primary",
            isWinner && "border-yellow-400",
            !canVote ? "opacity-70" : "hover:border-primary/80"
        )}>
             {isWinner && (
                <div className="absolute top-2 right-2 bg-yellow-400 p-1 rounded-full z-10 shadow-lg">
                    <Trophy className="h-4 w-4 text-background" />
                </div>
            )}
            <CardHeader>
                <CardTitle className="font-headline text-primary">{option.name}</CardTitle>
                {addedByUser && (
                    <CardDescription className="flex items-center gap-2 text-xs">
                        <Avatar className="h-4 w-4">
                            {addedByUser.avatarUrl ? <AvatarImage src={addedByUser.avatarUrl} alt={addedByUser.name} /> : <AvatarFallback className="text-xs"><UserCircle /></AvatarFallback>}
                        </Avatar>
                        Dodane przez {addedByUser.name}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                 {hasVoted && (
                    <Badge variant="default" className="w-full justify-center bg-primary/20 text-primary border border-primary/50">
                        <Check className="mr-2"/> Twój głos
                    </Badge>
                )}
                
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                            <Users className="mr-2 text-primary" /> 
                            Głosy ({voters.length})
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56">
                        <p className="font-semibold mb-2 text-sm">Głosujący</p>
                        <VoterList users={voters} />
                    </PopoverContent>
                </Popover>

                <Progress value={votePercentage} indicatorClassName={cn(isWinner ? "bg-yellow-400" : "bg-primary")} />

            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                 {option.link && (
                    <Button variant="outline" asChild className="w-full">
                        <a href={option.link} target="_blank" rel="noopener noreferrer">
                            <LinkIcon className="mr-2" /> Zobacz menu
                        </a>
                    </Button>
                )}
                {canVote && (
                    <Button onClick={() => toggleVote(eventId, option.id)} variant="glass" className="w-full" >
                        {hasVoted ? 'Cofnij głos' : 'Głosuj'}
                    </Button>
                )}
                {isWinner && (
                    <Button onClick={() => createOrderFromVote(eventId, option.id)} variant="default" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                        <ShoppingCart className="mr-2" /> Utwórz zamówienie z tej opcji
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

export default function VotingEventCard({ event }: { event: FoodOrder }) {
    const { user, allUsers, toggleOrderState, removeFoodOrder } = useContext(AppContext);
    const [isAddOptionOpen, setIsAddOptionOpen] = useState(false);
    
    if (!user || event.type !== 'voting' || !event.votingOptions) return null;

    const creator = allUsers.find(u => u.id === event.creatorId);
    const isCreator = user.id === event.creatorId;
    const isAdmin = user.role === 'admin';
    const isDeadlinePassed = event.deadline ? isPast(new Date(event.deadline)) : false;

    const canVote = event.isOpen && !isDeadlinePassed;
    const isClosed = !event.isOpen || isDeadlinePassed;

    const totalVotes = useMemo(() => {
        if (!event.votingOptions) return 0;
        let total = 0;
        event.votingOptions.forEach(opt => total += opt.votes.length);
        return total;
    }, [event.votingOptions]);
    
    const winningVoteCount = useMemo(() => {
        if (isClosed) {
             return Math.max(...(event.votingOptions?.map(opt => opt.votes.length) || [0]));
        }
        return 0;
    }, [isClosed, event.votingOptions]);
    
    return (
        <Card className="flex flex-col border-primary/30 w-full h-full bg-card">
            <CardHeader className="bg-secondary/50 rounded-t-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-xl text-primary">{event.companyName}</CardTitle>
                        {creator && (
                            <CardDescription className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Avatar className="h-4 w-4">
                                     {creator.avatarUrl ? <AvatarImage src={creator.avatarUrl} alt={creator.name} /> : <AvatarFallback><UserCircle /></AvatarFallback>}
                                </Avatar>
                                Stworzone przez {creator.name}
                            </CardDescription>
                        )}
                    </div>
                     {isClosed && (
                        <Badge className="flex items-center gap-1 bg-primary/80 text-white">
                            <Trophy className="h-3 w-3" /> Głosowanie zakończone
                        </Badge>
                    )}
                </div>
                 {event.description && <p className="text-sm text-muted-foreground pt-2 whitespace-pre-wrap">{event.description}</p>}
                {event.deadline && <CountdownTimer deadline={event.deadline} />}
            </CardHeader>
            <CardContent className="flex-grow flex flex-col min-h-0 p-4">
                 <ScrollArea className="flex-grow pr-4 -mr-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {event.votingOptions.length > 0 ? (
                            event.votingOptions.map((opt) => (
                                <VotingOptionCard
                                    key={opt.id}
                                    option={opt}
                                    eventId={event.id}
                                    totalVotes={totalVotes}
                                    isWinner={isClosed && winningVoteCount > 0 && opt.votes.length === winningVoteCount}
                                    isClosed={isClosed}
                                    canVote={canVote}
                                />
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-8 col-span-full">Brak opcji do głosowania. Dodaj pierwszą!</p>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 border-t pt-4 p-4 bg-secondary/30">
                {canVote && (
                    <Dialog open={isAddOptionOpen} onOpenChange={setIsAddOptionOpen}>
                        <DialogTrigger asChild>
                           <Button variant="outline" className="w-full">
                                <PlusCircle className="mr-2"/> Dodaj własną propozycję
                           </Button>
                        </DialogTrigger>
                        <DialogContent>
                             <DialogHeader>
                                <DialogTitle>Dodaj nową opcję do głosowania</DialogTitle>
                            </DialogHeader>
                            <AddOptionForm eventId={event.id} onAdded={() => setIsAddOptionOpen(false)} />
                        </DialogContent>
                    </Dialog>
                )}
                 {(isCreator || isAdmin) && event.isOpen && (
                     <div className="w-full space-y-2 pt-2 border-t mt-2">
                        <p className="text-xs font-semibold text-muted-foreground">Akcje twórcy</p>
                        <Button variant="secondary" className="w-full" onClick={() => toggleOrderState(event.id)}>
                            <X className="mr-2"/> Zakończ głosowanie
                        </Button>
                     </div>
                )}
                 {(isCreator || isAdmin) && (
                    <div className="w-full space-y-2 pt-2 border-t border-dashed border-primary mt-2">
                        <p className="text-xs font-semibold text-primary flex items-center gap-1"><ShieldCheck /> Akcje administratora / twórcy</p>
                        <div className="flex gap-2">
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button className="flex-1" variant="destructive">
                                        <Trash2 className="mr-2" /> Usuń
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Czy na pewno chcesz usunąć to wydarzenie?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Tej akcji nie można cofnąć. Spowoduje to trwałe usunięcie głosowania
                                            i wszystkich powiązanych z nim danych.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Anuluj</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => removeFoodOrder(event.id)}>Usuń</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                             <Button className="flex-1" variant="outline" disabled>
                                <Pencil className="mr-2" /> Edytuj
                            </Button>
                        </div>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}

    