
"use client";

import { useContext } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppContext } from "@/contexts/app-context";
import { ScrollArea } from "./ui/scroll-area";
import { LogOut, UserCircle, ShieldCheck } from "lucide-react";
import PortfolioSection from "./portfolio-section";
import { Badge } from "./ui/badge";

const ProviderIcon = ({ provider }: { provider?: 'google' | 'discord' | 'microsoft' }) => {
    if (provider === 'google') {
        return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.16c1.56 0 2.95.54 4.04 1.58l3.11-3.11C17.45 1.45 14.97 0 12 0 7.7 0 3.99 2.47 2.18 5.96l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
    }
    if (provider === 'discord') {
        return <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.36981C18.699 3.32501 16.634 2.56251 14.445 2.18181C14.336 2.48481 14.22 2.78031 14.125 3.06831C12.247 2.83101 10.422 2.83101 8.586 3.06831C8.481 2.78031 8.366 2.48481 8.257 2.18181C6.068 2.56251 4.003 3.32501 2.386 4.36981C0.632 6.94981 -0.019 9.94831 0.001 13.0153C1.683 14.5453 3.639 15.6303 5.762 16.2343C6.071 15.8273 6.347 15.3913 6.591 14.9283C6.126 14.6998 5.684 14.4433 5.266 14.1583C5.178 14.0953 5.109 14.0143 5.062 13.9143C4.943 13.6823 4.964 13.4003 5.101 13.1833C7.175 11.2363 9.789 10.2793 12.35 10.2793C14.912 10.2793 17.525 11.2363 19.599 13.1833C19.736 13.4003 19.757 13.6823 19.638 13.9143C19.591 14.0143 19.522 14.0953 19.434 14.1583C19.016 14.4433 18.574 14.6998 18.109 14.9283C18.353 15.3913 18.629 15.8273 18.938 16.2343C21.062 15.6303 23.018 14.5453 24.699 13.0153C24.739 9.87331 24.019 6.88831 22.317 4.36981H20.317Z" fill="#5865F2" />
            <path d="M8.202 12.634C7.42 12.634 6.784 11.976 6.784 11.168C6.784 10.36 7.41 9.702 8.202 9.702C8.994 9.702 9.63 10.36 9.63 11.168C9.63 11.976 8.994 12.634 8.202 12.634Z" fill="white" />
            <path d="M16.502 12.634C15.72 12.634 15.084 11.976 15.084 11.168C15.084 10.36 15.71 9.702 16.502 9.702C17.294 9.702 17.93 10.36 17.93 11.168C17.93 11.976 17.294 12.634 16.502 12.634Z" fill="white" />
        </svg>
    }
    if (provider === 'microsoft') {
        return <svg className="h-4 w-4" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1H10.2321V10.2321H1V1Z" fill="#F25022"/>
            <path d="M12.7679 1H22V10.2321H12.7679V1Z" fill="#7FBA00"/>
            <path d="M1 12.7679H10.2321V22H1V12.7679Z" fill="#00A4EF"/>
            <path d="M12.7679 12.7679H22V22H12.7679V12.7679Z" fill="#FFB900"/>
        </svg>
    }
    return <ShieldCheck className="h-4 w-4" />;
}


export default function UserProfile() {
  const { user, logout } = useContext(AppContext);

  if (!user) return null;

  const providerName = user.provider ? user.provider.charAt(0).toUpperCase() + user.provider.slice(1) : 'Email';

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
             {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : <AvatarFallback className="text-muted-foreground"><UserCircle className="h-full w-full" /></AvatarFallback> }
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[650px] flex flex-col p-0">
        <SheetHeader className="text-left p-6 pb-4 bg-secondary/50">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
               {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : <AvatarFallback className="text-muted-foreground"><UserCircle className="h-full w-full" /></AvatarFallback> }
            </Avatar>
            <div>
              <SheetTitle className="font-headline text-2xl">{user.name}</SheetTitle>
              <SheetDescription>{user.email}</SheetDescription>
            </div>
          </div>
        </SheetHeader>
        
        <div className="border-t border-b p-6 text-sm">
            <h4 className="font-semibold mb-2">Bezpieczeństwo konta</h4>
            <div className="flex items-center gap-2 text-muted-foreground">
                <ProviderIcon provider={user.provider} />
                <span>Konto połączone z {providerName}</span>
            </div>
        </div>
        
        <ScrollArea className="flex-grow p-6">
            <PortfolioSection />
        </ScrollArea>

        <div className="mt-auto border-t p-6 bg-background">
          <Button variant="outline" className="w-full" onClick={logout}>
            <LogOut className="mr-2"/> Wyloguj
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
