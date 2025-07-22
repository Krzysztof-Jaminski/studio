
"use client";

import { useContext, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppContext } from '@/contexts/app-context';
import type { FoodOrder, User, VotingOption } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { UserCircle, Check, X, ShieldCheck, Trash2, Trophy, Users, PlusCircle, Link as LinkIcon, Pencil, ShoppingCart } from 'lucide-react';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { isPast } from 'date-fns';
import CountdownTimer from './countdown-timer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import AddOptionForm from './add-option-form';

const VoterList = ({ users }: { users: User[] }) => (
    <div className="flex flex-wrap gap-1 -space-x-2">
        {users.length > 0 ? users.map(user => (
            <TooltipProvider key={user.id} delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Avatar className="h-8 w-8 border-2 border-background">
                            {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : <AvatarFallback className="text-muted-foreground text-xs"><UserCircle /></AvatarFallback>}
                        </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{user.name}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )) : <p className="text-xs text-muted-foreground pl-2">Brak głosów.</p>}
    </div>
);


const VotingOptionCard = ({ option, eventId, totalVotes, isWinner, isClosed, canVote }: { option: VotingOption, eventId: string, totalVotes: number, isWinner: boolean, isClosed: boolean, canVote: boolean }) => {
    const { user, allUsers, toggleVote, createOrderFromVote } = useContext(AppContext);
    if (!user) return null;

    const voters = option.votes.map(id => allUsers.find(u => u.id === id)).filter(Boolean) as User[];
    const hasVoted = option.votes.includes(user.id);
    const votePercentage = totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;

    return (
        <Card className={cn(
            "flex flex-col space-y-3 relative h-full bg-secondary/80 p-4 transition-all hover:shadow-md",
            isClosed ? "hover:border-primary/50" : "hover:border-primary",
            hasVoted && "border-primary",
            isWinner && "border-yellow-400"
        )}>
             {isWinner && (
                <div className="absolute -top-3 -right-3 bg-yellow-400 p-1 rounded-full z-10 shadow-lg">
                    <Trophy className="h-5 w-5 text-background" />
                </div>
            )}
            <div className="flex items-start gap-4">
                <div className={cn("h-16 w-16 flex items-center justify-center bg-background/20 rounded-md border-2 border-border", option.link && "text-primary")}>
                    <LinkIcon className="h-8 w-8 " />
                </div>
                <div className="flex-1">
                    <p className="font-bold text-lg text-primary">{option.name}</p>
                     {option.link && (
                        <Button variant="link" asChild className="p-0 h-auto -ml-1 text-primary/80 hover:text-primary">
                           <a href={option.link} target="_blank" rel="noopener noreferrer">
                               <LinkIcon className="mr-1" /> Zobacz menu
                           </a>
                       </Button>
                    )}
                </div>
            </div>
             <div className="space-y-2 flex-grow">
                 <p className="text-sm font-semibold flex items-center gap-2"><Users className="text-muted-foreground"/>Głosy ({option.votes.length})</p>
                 <VoterList users={voters} />
             </div>
             
            {isClosed && <Progress value={votePercentage} indicatorClassName={cn(isWinner ? "bg-yellow-400" : "bg-primary")} />}
            
            {canVote && (
                <Button onClick={() => toggleVote(eventId, option.id)} variant="glass" className={cn("w-full mt-auto text-white")} >
                    {hasVoted ? <Check className="mr-2" /> : null}
                    {hasVoted ? 'Cofnij głos' : 'Głosuj'}
                </Button>
            )}

            {isWinner && (
                 <Button onClick={() => createOrderFromVote(eventId, option.id)} variant="default" className="w-full mt-auto bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                    <ShoppingCart className="mr-2" /> Utwórz zamówienie z tej opcji
                </Button>
            )}
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
        const allVoters = new Set<string>();
        event.votingOptions?.forEach(opt => opt.votes.forEach(voterId => allVoters.add(voterId)));
        return allVoters.size;
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
                             <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={() => removeFoodOrder(event.id)}>
                                <Trash2 className="mr-2" /> Usuń
                            </Button>
                             <Button className="flex-1" variant="outline">
                                <Pencil className="mr-2" /> Edytuj
                            </Button>
                        </div>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}

    