
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
        return <svg className="h-4 w-4" fill="#5865F2" viewBox="0 0 128 96" role="img" xmlns="http://www.w3.org/2000/svg">
            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,9.8,89.57,89.57,0,0,0,24.42,0C1.73,12.11-5.43,34.43,2.41,56.21,14.07,78.22,34,92.34,55.13,96a77.2,77.2,0,0,0,10.15-4.43,63.22,63.22,0,0,1-3.64-5.63c-3.41,2.06-6.43,3.57-9.22,4.64-4.07,1.52-7.86,2.32-11.42,2.26-21.54-1.84-35.15-17.5-40.09-34.43C-1.35,36.17,4.36,19.85,14.19,9.73,28.69,13.24,42.05,15.8,54.5,15.8c1.73,0,3.47-.08,5.2-.24a66.44,66.44,0,0,0-5.12-10,79.52,79.52,0,0,0,6.44-3.11,94.3,94.3,0,0,0,24-1.79C104.75,12.12,112.18,24.12,117,39.34,101.4,26.79,84.13,19.34,66.27,16.3c1.37-2.06,2.66-4.12,3.85-6.17a80.34,80.34,0,0,1,21.54-9.19C102.3,13.88,107.1,23.33,110.3,32.34,125.14,21.19,130.5,2.14,107.7,8.07ZM42.45,65.69C36.65,65.69,32,60.6,32,54.11S36.65,42.53,42.45,42.53,53,47.62,52.89,54.11,48.25,65.69,42.45,65.69Zm33.24,0c-5.8,0-10.45-5.09-10.45-11.58s4.65-11.58,10.45-11.58,10.45,5.09,10.34,11.58S81.49,65.69,75.69,65.69Z"/>
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
