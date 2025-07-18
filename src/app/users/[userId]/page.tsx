"use client";

import { useContext, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppContext } from '@/contexts/app-context';
import type { PortfolioItem, User } from '@/lib/types';
import Header from '@/components/header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, FileText, Link as LinkIcon, Pencil, Trash2, UserCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const PortfolioCard = ({ item }: { item: PortfolioItem }) => (
    <Card className="flex flex-col">
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="font-headline text-lg">{item.title}</CardTitle>
                    <CardDescription>
                        {item.type === 'status' && `Status for week of ${format(parseISO(item.weekOf!), 'MMMM d, yyyy')}`}
                        {item.type === 'project' && `Added on ${format(parseISO(item.date), 'MMMM d, yyyy')}`}
                    </CardDescription>
                </div>
                <Badge variant={item.type === 'status' ? 'secondary' : 'default'}>{item.type}</Badge>
            </div>
        </CardHeader>
        <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.description}</p>
            {item.technologies && item.technologies.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {item.technologies.map(tech => <Badge key={tech} variant="outline">{tech}</Badge>)}
                </div>
            )}
        </CardContent>
        {item.link && (
            <CardFooter>
                 <Button variant="link" asChild className="p-0 h-auto">
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                        <LinkIcon className="mr-2" /> View Link
                    </a>
                </Button>
            </CardFooter>
        )}
    </Card>
);

export default function UserProfilePage() {
  const { getUserById } = useContext(AppContext);
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPortfolio, setUserPortfolio] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      const { user, portfolio } = getUserById(userId);
      if (user) {
        setProfileUser(user);
        setUserPortfolio(portfolio.filter(item => item.isVisible));
      }
      setIsLoading(false);
    }
  }, [userId, getUserById]);
  
  if (isLoading) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-5 w-64" />
                    </div>
                </div>
                <Skeleton className="h-96 w-full" />
            </main>
        </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
            <p className="text-lg">User not found.</p>
            <Button onClick={() => router.push('/users')} className="mt-4">Back to Users List</Button>
        </main>
      </div>
    );
  }

  const sortedPortfolio = userPortfolio.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const statuses = sortedPortfolio.filter(item => item.type === 'status');
  const projects = sortedPortfolio.filter(item => item.type === 'project');

  return (
    <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto px-4 py-8">
            <Button variant="outline" onClick={() => router.back()} className="mb-6">
                <ArrowLeft className="mr-2" />
                Back
            </Button>
            <div className="flex items-center gap-6 mb-8">
                <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-muted-foreground">
                        <UserCircle className="h-full w-full" />
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-4xl font-bold font-headline">{profileUser.name}</h1>
                    <p className="text-lg text-muted-foreground">{profileUser.email}</p>
                </div>
            </div>

            <Separator className="my-8" />

             <div className="space-y-6">
                 {/* Projects */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold font-headline">Projects</h2>
                    {projects.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {projects.map(item => <PortfolioCard key={item.id} item={item} />)}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm">This user hasn't added any projects yet.</p>
                    )}
                </div>

                <Separator className="my-8" />

                {/* Weekly Statuses */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold font-headline">Weekly Statuses</h2>
                    {statuses.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {statuses.map(item => <PortfolioCard key={item.id} item={item} />)}
                        </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
                            <FileText className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 font-medium">No Public Statuses</p>
                            <p className="text-sm text-muted-foreground">This user has no public statuses yet.</p>
                        </div>
                    )}
                </div>
            </div>

        </main>
    </div>
  );
}
