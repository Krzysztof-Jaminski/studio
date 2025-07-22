
"use client";

import { useContext, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppContext } from '@/contexts/app-context';
import type { PortfolioItem, User, Reservation } from '@/lib/types';
import Header from '@/components/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase, Eye, FileText, Globe, Link as LinkIcon, Pencil, ShieldCheck, Sigma, Trash2, UserCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const PortfolioCard = ({ item }: { item: PortfolioItem }) => (
    <Card className="flex flex-col bg-card">
        <CardHeader className="bg-secondary/50">
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="font-headline text-lg text-white">{item.title}</CardTitle>
                    <CardDescription>
                        {item.type === 'status' && item.weekOf && `Status na tydzień ${format(parseISO(item.weekOf), 'd MMMM yyyy', { locale: pl })}`}
                        {item.type === 'project' && `Dodano ${format(parseISO(item.date), 'd MMMM yyyy', { locale: pl })}`}
                    </CardDescription>
                </div>
                <Badge variant={item.type === 'status' ? 'default' : 'secondary'} className={cn(item.type === 'status' ? 'bg-accent/80 text-white' : 'bg-primary/80 text-white')}>{item.type === 'status' ? 'Status' : 'Projekt'}</Badge>
            </div>
        </CardHeader>
        <CardContent className="flex-grow pt-4">
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
                        <LinkIcon className="mr-2" /> Zobacz link
                    </a>
                </Button>
            </CardFooter>
        )}
    </Card>
);

const StatCard = ({ icon, label, value, colorClass }: { icon: React.ReactNode, label: string, value: number, colorClass: string }) => (
    <Card className="bg-secondary/50">
        <CardContent className="p-4 flex items-center gap-4">
            <div className={cn("p-3 rounded-lg", colorClass)}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
            </div>
        </CardContent>
    </Card>
);


export default function UserProfilePage() {
  const { getUserById, allUsers, reservations } = useContext(AppContext);
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPortfolio, setUserPortfolio] = useState<PortfolioItem[]>([]);
  const [userStats, setUserStats] = useState({ office: 0, online: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId && allUsers.length > 0) {
      const { user, portfolio } = getUserById(userId);
      if (user) {
        setProfileUser(user);
        setUserPortfolio(portfolio.filter(item => item.isVisible));
        
        const officeDays = reservations.filter(r => r.office.includes(userId)).length;
        const onlineDays = reservations.filter(r => r.online.includes(userId)).length;
        setUserStats({
            office: officeDays,
            online: onlineDays,
            total: officeDays + onlineDays,
        });

      }
      setIsLoading(false);
    }
  }, [userId, getUserById, allUsers, reservations]);
  
  if (isLoading) {
    return (
        <div className="min-h-screen text-foreground">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-5 w-64" />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
                <Skeleton className="h-96 w-full" />
            </main>
        </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen text-foreground">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
            <p className="text-lg">Nie znaleziono użytkownika.</p>
            <Button onClick={() => router.push('/users')} variant="glass" className="mt-4">Wróć do listy</Button>
        </main>
      </div>
    );
  }

  const sortedPortfolio = userPortfolio.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const statuses = sortedPortfolio.filter(item => item.type === 'status');
  const projects = sortedPortfolio.filter(item => item.type === 'project');

  return (
    <div className="min-h-screen text-foreground">
        <Header />
        <main className="container mx-auto px-4 py-8">
            <Button variant="outline" onClick={() => router.back()} className="mb-6">
                <ArrowLeft className="mr-2" />
                Wróć
            </Button>
            <div className="flex items-center gap-6 mb-8">
                <Avatar className="h-24 w-24 border-2 border-primary">
                   {profileUser.avatarUrl ? <AvatarImage src={profileUser.avatarUrl} alt={profileUser.name} /> : <AvatarFallback className="text-muted-foreground"><UserCircle className="h-full w-full" /></AvatarFallback> }
                </Avatar>
                <div>
                    <h1 className="text-4xl font-bold font-headline flex items-center gap-2 text-gradient">
                        {profileUser.name}
                        {profileUser.role === 'admin' && <ShieldCheck className="h-8 w-8 text-primary" />}
                    </h1>
                    <p className="text-lg text-muted-foreground">Praktykant w PraktykanciHub</p>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold font-headline mb-4 text-white">Statystyki obecności</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard icon={<Briefcase className="h-6 w-6 text-primary-foreground" />} label="Dni w biurze" value={userStats.office} colorClass="bg-primary" />
                    <StatCard icon={<Globe className="h-6 w-6 text-accent-foreground" />} label="Dni online" value={userStats.online} colorClass="bg-accent" />
                    <StatCard icon={<Sigma className="h-6 w-6 text-primary-foreground" />} label="Wszystkie rezerwacje" value={userStats.total} colorClass="bg-secondary" />
                </div>
            </div>

            <Separator className="my-8" />

             <div className="space-y-8">
                 {/* Projects */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold font-headline text-white">Portfolio projektów</h2>
                    {projects.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {projects.map(item => <PortfolioCard key={item.id} item={item} />)}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm">Ten użytkownik nie dodał jeszcze żadnych projektów.</p>
                    )}
                </div>

                <Separator className="my-8" />

                {/* Weekly Statuses */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold font-headline text-white">Statusy tygodniowe</h2>
                    {statuses.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {statuses.map(item => <PortfolioCard key={item.id} item={item} />)}
                        </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center">
                            <FileText className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 font-medium">Brak publicznych statusów</p>
                            <p className="text-sm text-muted-foreground">Ten użytkownik nie opublikował jeszcze żadnych statusów.</p>
                        </div>
                    )}
                </div>
            </div>

        </main>
    </div>
  );
}
