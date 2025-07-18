"use client";

import { useContext } from 'react';
import Link from 'next/link';
import { AppContext } from '@/contexts/app-context';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle } from 'lucide-react';
import type { User } from '@/lib/types';

const UserCard = ({ user }: { user: User }) => {
    return (
        <Link href={`/users/${user.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                        <AvatarFallback className="text-muted-foreground">
                           <UserCircle className="h-full w-full" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-lg">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default function UsersPage() {
  const { allUsers, user: currentUser } = useContext(AppContext);
  
  // Filter out the current user from the list
  const otherUsers = allUsers.filter(u => u.id !== currentUser?.id);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold font-headline">Interns</h1>
            <p className="text-muted-foreground">Browse profiles of other interns in the program.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherUsers.map(user => (
                <UserCard key={user.id} user={user} />
            ))}
        </div>
      </main>
    </div>
  );
}
