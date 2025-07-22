
"use client";

import { useContext, useMemo, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppContext } from '@/contexts/app-context';
import type { FoodOrder, User, VotingOption } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { UserCircle, Check, X, ShieldCheck, Trash2, Trophy, Users, PlusCircle, Link as LinkIcon } from 'lucide-react';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { isPast } from 'date-fns';
import CountdownTimer from './countdown-timer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

const VoterList = ({ users }: { users: User[] }) => (
    <div className="flex flex-wrap gap-2">
        {users.length > 0 ? users.map(user => (
            <div key={user.id} className="flex items-center gap-2 text-sm p-1 bg-gray-100 rounded-md">
                <Avatar className="h-6 w-6">
                    {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : <AvatarFallback className="text-muted-foreground text-xs"><UserCircle /></AvatarFallback>}
                </Avatar>
                <span>{user.name}</span>
            </div>
        )) : <p className="text-xs text-muted-foreground">Brak głosów.</p>}
    </div>
);

const AddOptionForm = ({ eventId, onAdded }: { eventId: string, onAdded: () => void }) => {
    const { addVotingOption } = useContext(AppContext);
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name) {
            addVotingOption(eventId, { name, link, imageUrl });
            onAdded();
            setName('');
            setLink('');
            setImageUrl('');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="option-name">Nazwa firmy</Label>
                <Input id="option-name" value={name} onChange={e => setName(e.target.value)} required placeholder="np. Burger King"/>
            </div>
            <div>
                <Label htmlFor="option-link">Link do menu (opcjonalnie)</Label>
                <Input id="option-link" value={link} onChange={e => setLink(e.target.value)} placeholder="https://example.com/menu"/>
            </div>
             <div>
                <Label htmlFor="option-image">URL obrazka (opcjonalnie)</Label>
                <Input id="option-image" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/logo.png"/>
            </div>
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">Dodaj opcję</Button>
        </form>
    )
}

const VotingOptionCard = ({ option, eventId, totalVotes, isWinner, isClosed, canVote }: { option: VotingOption, eventId: string, totalVotes: number, isWinner: boolean, isClosed: boolean, canVote: boolean }) => {
    const { user, allUsers, toggleVote } = useContext(AppContext);
    if (!user) return null;

    const voters = option.votes.map(id => allUsers.find(u => u.id === id)).filter(Boolean) as User[];
    const hasVoted = option.votes.includes(user.id);
    const votePercentage = totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;

    return (
        <Card className="flex flex-col space-y-3 relative h-full bg-card p-4 transition-all hover:shadow-md">
             {isWinner && (
                <div className="absolute -top-3 -right-3 bg-yellow-400 p-1 rounded-full z-10 shadow-lg">
                    <Trophy className="h-5 w-5 text-white" />
                </div>
            )}
            <div className="flex items-start gap-4">
                <Image src={option.imageUrl || 'https://placehold.co/64x64.png'} alt={option.name} width={64} height={64} className="rounded-md border h-16 w-16 object-cover" data-ai-hint="logo" />
                <div className="flex-1">
                    <p className="font-bold text-lg text-orange-800">{option.name}</p>
                     {option.link && (
                        <Button variant="link" asChild className="p-0 h-auto -ml-1 text-orange-600">
                           <a href={option.link} target="_blank" rel="noopener noreferrer">
                               <LinkIcon className="mr-1" /> Zobacz menu
                           </a>
                       </Button>
                    )}
                </div>
            </div>
             <div className="space-y-2">
                 <p className="text-sm font-semibold flex items-center gap-2"><Users className="text-muted-foreground"/>Głosy ({option.votes.length})</p>
                 <VoterList users={voters} />
             </div>
             
            {isClosed && <Progress value={votePercentage} indicatorClassName={cn(isWinner ? "bg-yellow-400" : "bg-orange-400")} />}
            
            {canVote && (
                <Button onClick={() => toggleVote(eventId, option.id)} className={cn("w-full mt-auto text-white", hasVoted ? "bg-orange-600 hover:bg-orange-700" : "bg-orange-500 hover:bg-orange-600")} >
                    {hasVoted ? <Check className="mr-2" /> : null}
                    {hasVoted ? 'Cofnij Głos' : 'Głosuj'}
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
        // Since users can vote for multiple options, we count unique voters across all options.
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
        <Card className="flex flex-col border-orange-200 w-full">
            <CardHeader className="bg-orange-50 rounded-t-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-xl text-orange-900">{event.companyName}</CardTitle>
                        {creator && (
                            <CardDescription className="flex items-center gap-2 text-xs">
                                <Avatar className="h-4 w-4">
                                     {creator.avatarUrl ? <AvatarImage src={creator.avatarUrl} alt={creator.name} /> : <AvatarFallback><UserCircle /></AvatarFallback>}
                                </Avatar>
                                Utworzone przez {creator.name}
                            </CardDescription>
                        )}
                    </div>
                     {isClosed && (
                        <Badge className="flex items-center gap-1 bg-orange-600 text-white">
                            <Trophy className="h-3 w-3" /> Głosowanie zakończone
                        </Badge>
                    )}
                </div>
                 {event.description && <p className="text-sm text-muted-foreground pt-2 whitespace-pre-wrap">{event.description}</p>}
                {event.deadline && <CountdownTimer deadline={event.deadline} />}
            </CardHeader>
            <CardContent className="flex-grow flex flex-col min-h-0 p-4">
                 <ScrollArea className="flex-grow pr-4 -mr-4">
                    <div className="space-y-4">
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
                            <p className="text-sm text-muted-foreground text-center py-8">Brak opcji do głosowania.</p>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 border-t pt-4 p-4 bg-orange-50/50">
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
                        <Button variant="secondary" className="w-full bg-orange-100 text-orange-800 hover:bg-orange-200" onClick={() => toggleOrderState(event.id)}>
                            <X className="mr-2"/> Zakończ głosowanie
                        </Button>
                     </div>
                )}
                 {isAdmin && (
                    <div className="w-full space-y-2 pt-2 border-t border-dashed border-orange-500 mt-2">
                        <p className="text-xs font-semibold text-orange-500 flex items-center gap-1"><ShieldCheck /> Akcje administratora</p>
                        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white" onClick={() => removeFoodOrder(event.id)}>
                            <Trash2 className="mr-2" /> Usuń całe wydarzenie
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
