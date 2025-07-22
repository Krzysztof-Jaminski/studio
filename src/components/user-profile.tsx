
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
        return <svg className="h-4 w-4" fill="#5865F2" viewBox="0 0 28 21" role="img" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.021 1.684c-1.842-.8-3.785-1.28-5.828-1.536a.066.066 0 0 0-.08.136c-1.793.64-3.515 1.543-5.063 2.642-2.122-1.447-4.529-2.29-7.043-2.658a.06.06 0 0 0-.087-.107C2.848.423.877.93.05 2.704c-2.17 1.02-3.856 2.65-4.99 4.63a4.43 4.43 0 0 0-.757 1.771 2.83 2.83 0 0 0-.043.193c.014.05.029.1.05.143.929 4.314 4.143 7.643 7.828 9.471a.1.1 0 0 0 .164.043c.007-.021.014-.043.021-.064.593-.507 1.121-1.071 1.586-1.686a.04.04 0 0 0-.064-.05c-.45-.335-.886-.7-1.271-1.078a.05.05 0 0 1 .071-.036c.85.493 1.743.893 2.678 1.207a.12.12 0 0 0 .15.036c-.007-.029-.021-.057-.029-.086-.236-.614-.429-1.243-.572-1.885a.06.06 0 0 1 .143-.036A22.95 22.95 0 0 0 14.015 18c.636.014 1.271.014 1.907-.007a.06.06 0 0 1 .129.043c-.143.643-.336 1.271-.572 1.886a.06.06 0 0 0-.028.085c.05-.015.1-.022.15-.036.936-.314 1.829-.714 2.679-1.207a.04.04 0 0 1 .064.028c.014.008.028.015.043.022-1.393.385-1.829.742-2.279 1.078a.04.04 0 0 0-.063.063c.464.615.993 1.18 1.586 1.686a.06.06 0 0 0 .021.064c.057-.007.114-.022.164-.043 3.686-1.828 6.9-5.157 7.828-9.47a.08.08 0 0 0 .05-.143 4.35 4.35 0 0 0-.042-.193c-.19-.614-.443-1.207-.758-1.77-1.135-1.98-2.82-3.61-4.99-4.63zm-9.336 8.357c-1.421 0-2.571-1.21-2.571-2.71s1.15-2.71 2.571-2.71c1.436 0 2.586 1.21 2.571 2.71.015 1.5-1.135 2.71-2.57 2.71zm8.643 0c-1.421 0-2.571-1.21-2.571-2.71s1.15-2.71 2.571-2.71c1.436 0 2.586 1.21 2.571 2.71.014 1.5-1.135 2.71-2.57 2.71z"/>
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

    