
"use client";

import { useContext } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppContext } from "@/contexts/app-context";
import { Logo } from './icons';

// Dummy SVG icons for providers
const GoogleIcon = () => (
  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.16c1.56 0 2.95.54 4.04 1.58l3.11-3.11C17.45 1.45 14.97 0 12 0 7.7 0 3.99 2.47 2.18 5.96l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const DiscordIcon = () => (
    <svg className="mr-2 h-5 w-5" fill="#5865F2" viewBox="0 0 28 21">
        <path d="M23.021 1.684c-1.842-.8-3.785-1.28-5.828-1.536-.029.043-.058.093-.08.136-1.793.64-3.515 1.543-5.063 2.642-2.122-1.447-4.529-2.29-7.043-2.658-.029-.036-.058-.071-.087-.107-2.072.263-4.043.77-5.828 1.543-2.17 1.02-3.856 2.65-4.99 4.63-.315.564-.567 1.157-.757 1.771-.021.064-.035.129-.043.193.014.05.029.1.05.143.929 4.314 4.143 7.643 7.828 9.471.05.021.107.036.164.043.007-.021.014-.043.021-.064.593-.507 1.121-1.071 1.586-1.686-.021-.014-.043-.029-.064-.05-.45-.335-.886-.7-.1271-1.078.021-.014.036-.029.057-.043.029-.014.05-.021.071-.036.85.493 1.743.893 2.678 1.207.05.014.1.021.15.036-.007-.029-.021-.057-.029-.086-.236-.614-.429-1.243-.572-1.885.05-.007.1-.021.143-.036A22.95 22.95 0 0 0 14.015 18c.636.014 1.271.014 1.907-.007.043.015.086.029.129.043-.143.643-.336 1.271-.572 1.886-.007.028-.021.057-.028.085.05-.015.1-.022.15-.036.936-.314 1.829-.714 2.679-1.207.021.007.043.014.064.028.014.008.028.015.043.022-1.393.385-1.829.742-2.279 1.078-.021.021-.042.042-.063.063.464.615.993 1.18 1.586 1.686.007.021.014.043.021.064.057-.007.114-.022.164-.043 3.686-1.828 6.9-5.157 7.828-9.47.022-.044.036-.093.05-.143a4.35 4.35 0 0 0-.042-.193c-.19-.614-.443-1.207-.758-1.77-1.135-1.98-2.82-3.61-4.99-4.63zm-9.336 8.357c-1.421 0-2.571-1.21-2.571-2.71s1.15-2.71 2.571-2.71c1.436 0 2.586 1.21 2.571 2.71.015 1.5-1.135 2.71-2.57 2.71zm8.643 0c-1.421 0-2.571-1.21-2.571-2.71s1.15-2.71 2.571-2.71c1.436 0 2.586 1.21 2.571 2.71.014 1.5-1.135 2.71-2.57 2.71z"/>
    </svg>
);


export default function Login() {
  const { login } = useContext(AppContext);

  const handleLogin = (provider: 'google' | 'discord') => {
    // In a real app, this would trigger the OAuth flow.
    // For this prototype, we'll simulate it by logging in a mock user.
    if (provider === 'google') {
      login('user-2', 'google'); // Jane Smith as Google user
    } else {
      login('user-1', 'discord'); // John Doe as Discord user
    }
  };

  return (
      <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Logo className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl">Witaj w PraktykanciHub</CardTitle>
            <CardDescription>Zaloguj się, aby zarezerwować miejsce i dołączyć do społeczności.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" onClick={() => handleLogin('google')}>
              <GoogleIcon /> Zaloguj przez Google
            </Button>
            <Button className="w-full" onClick={() => handleLogin('discord')}>
              <DiscordIcon /> Zaloguj przez Discord
            </Button>
          </CardContent>
           <CardFooter className="text-center text-xs text-muted-foreground">
            <p>Logując się, akceptujesz nasze warunki i politykę prywatności.</p>
          </CardFooter>
      </Card>
  );
}
