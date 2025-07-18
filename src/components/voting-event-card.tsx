
"use client";

import { useContext, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppContext } from '@/contexts/app-context';
import type { FoodOrder, User, VotingOption } from '@/lib/types';
import { Avatar, AvatarFallback } from './ui/avatar';
import { UserCircle, Check, X, ShieldCheck, Trash2, Trophy, Users } from 'lucide-react';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';

const UserList = ({ users }: { users: User[] }) => (
    <div className="space-y-2">
        {users.length > 0 ? users.map(user => (
            <div key={user.id} className="flex items-center gap-2 text-sm">
                <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-muted-foreground text-xs"><UserCircle /></AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
            </div>
        )) : <p className="text-xs text-muted-foreground">No votes yet.</p>}
    </div>
);

const VotingOptionCard = ({ option, eventId, totalVotes, isWinner, isClosed }: { option: VotingOption, eventId: string, totalVotes: number, isWinner: boolean, isClosed: boolean }) => {
    const { user, allUsers, toggleVote } = useContext(AppContext);
    if (!user) return null;

    const voters = option.votes.map(id => allUsers.find(u => u.id === id)).filter(Boolean) as User[];
    const hasVoted = option.votes.includes(user.id);
    const votePercentage = totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;

    return (
        <div className="rounded-lg border p-3 space-y-3 relative">
             {isWinner && (
                <div className="absolute -top-3 -right-3 bg-yellow-400 p-1 rounded-full z-10">
                    <Trophy className="h-5 w-5 text-white" />
                </div>
            )}
            <div className="flex items-start gap-3">
                <Image src={option.imageUrl || 'https://placehold.co/64x64.png'} alt={option.name} width={48} height={48} className="rounded-md border h-12 w-12 object-cover" data-ai-hint="logo" />
                <div className="flex-1">
                    <a href={option.link} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">{option.name}</a>
                    <p className="text-sm text-muted-foreground">{option.votes.length} vote(s)</p>
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                       <Button variant="ghost" size="icon" className="h-8 w-8"><Users /></Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56">
                        <p className="font-semibold mb-2 text-sm">Voters for {option.name}</p>
                        <UserList users={voters} />
                    </PopoverContent>
                </Popover>
            </div>
            {isClosed && <Progress value={votePercentage} indicatorClassName={cn(isWinner && "bg-yellow-400")} />}
            {!isClosed && (
                <Button onClick={() => toggleVote(eventId, option.id)} className="w-full" variant={hasVoted ? "default" : "outline"}>
                    {hasVoted ? <Check className="mr-2" /> : null}
                    {hasVoted ? 'Voted' : 'Vote'}
                </Button>
            )}
        </div>
    );
}

export default function VotingEventCard({ event }: { event: FoodOrder }) {
    const { user, allUsers, toggleOrderState, removeFoodOrder } = useContext(AppContext);
    
    if (!user || event.type !== 'voting' || !event.votingOptions) return null;

    const creator = allUsers.find(u => u.id === event.creatorId);
    const isCreator = user.id === event.creatorId;
    const isAdmin = user.role === 'admin';

    const totalVotes = useMemo(() => {
        return event.votingOptions?.reduce((sum, opt) => sum + opt.votes.length, 0) || 0;
    }, [event.votingOptions]);

    const winningVoteCount = useMemo(() => {
        if (!event.isOpen) {
             return Math.max(...(event.votingOptions?.map(opt => opt.votes.length) || [0]));
        }
        return 0;
    }, [event.isOpen, event.votingOptions]);
    
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-xl">{event.companyName}</CardTitle>
                        {creator && (
                            <CardDescription className="flex items-center gap-2 text-xs">
                                <Avatar className="h-4 w-4"><AvatarFallback><UserCircle /></AvatarFallback></Avatar>
                                Created by {creator.name}
                            </CardDescription>
                        )}
                    </div>
                     {!event.isOpen && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                            <Trophy className="h-3 w-3" /> Voting Closed
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
                <ScrollArea className="h-64 pr-4">
                    <div className="space-y-3">
                        {event.votingOptions.map(opt => (
                            <VotingOptionCard 
                                key={opt.id} 
                                option={opt} 
                                eventId={event.id}
                                totalVotes={totalVotes}
                                isWinner={!event.isOpen && winningVoteCount > 0 && opt.votes.length === winningVoteCount}
                                isClosed={!event.isOpen}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 border-t pt-4">
                 {(isCreator || isAdmin) && (
                     <div className="w-full space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground">Creator Actions</p>
                        <Button variant="secondary" className="w-full" onClick={() => toggleOrderState(event.id)} disabled={!event.isOpen}>
                            <X className="mr-2"/> Close Voting
                        </Button>
                     </div>
                )}
                 {isAdmin && (
                    <div className="w-full space-y-2 pt-2 border-t border-dashed border-red-500">
                        <p className="text-xs font-semibold text-red-500 flex items-center gap-1"><ShieldCheck /> Admin Actions</p>
                        <Button variant="destructive" className="w-full" onClick={() => removeFoodOrder(event.id)}>
                            <Trash2 className="mr-2" /> Delete Entire Event
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
