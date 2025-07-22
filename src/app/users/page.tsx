
"use client";

import { useContext } from 'react';
import Link from 'next/link';
import { AppContext } from '@/contexts/app-context';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShieldCheck, UserCircle } from 'lucide-react';
import type { User } from '@/lib/types';

const UserCard = ({ user, isCurrentUser }: { user: User, isCurrentUser: boolean }) => {
    return (
        <Link href={`/users/${user.id}`}>
            <Card className={`hover:shadow-md transition-shadow cursor-pointer ${isCurrentUser ? 'border-primary border-2' : ''}`}>
                <CardContent className="p-4 flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                        {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : <AvatarFallback className="text-muted-foreground"><UserCircle className="h-full w-full" /></AvatarFallback> }
                    </Avatar>
                    <div>
                        <p className="font-semibold text-lg flex items-center gap-2">
                            {user.name}
                            {user.role === 'admin' && <ShieldCheck className="h-5 w-5 text-primary" />}
                        </p>
                        <p className="text-sm text-muted-foreground">Praktykant</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default function UsersPage() {
  const { allUsers, user: currentUser } = useContext(AppContext);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold font-headline">Praktykanci</h1>
            <p className="text-muted-foreground">Przeglądaj profile innych uczestników programu.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allUsers.map(user => (
                <UserCard key={user.id} user={user} isCurrentUser={user.id === currentUser?.id} />
            ))}
        </div>
      </main>
    </div>
  );
}
