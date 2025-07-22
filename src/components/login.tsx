
"use client";

import { useContext } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppContext } from "@/contexts/app-context";
import { Logo } from './icons';
import { DialogHeader, DialogTitle } from './ui/dialog';

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
    <svg role="img" width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF" className="mr-2">
        <path d="M20.317 4.3698a19.7913 19.7913 0 0 0 -4.8851 -1.5152 .0741 .0741 0 0 0 -.0785 .0371c-.211 .3753 -.4464 .8245 -.6083 1.2495 -1.8447 -.2762 -3.68 -.2762 -5.4868 0 -.1619 -.425 -.3973 -.8742 -.6083 -1.2495 a .077 .077 0 0 0 -.0785 -.037
        c-1.7328 .4718 -3.3627 1.0095 -4.8851 1.5152 -2.5738 1.7733 -4.0777 3.907 -4.6318 6.0963 a .077 .077 0 0 0 .0276 .0868 c .4464 .334 .8928 .6432 1.2917 .9346 a .077 .077 0 0 0 .088 -.01 c .2996 -.2762 .589 -.5628 .8198 -.8972 a .077 .077 0 0 0 -.0435 -.106
        c-.3973 -.178 -.7652 -.3664 -1.1035 -.5628 a .077 .077 0 0 0 -.0986 .009c-.019 .0185 -.0276 .0463 -.019 .0648 c .23 .6114 .5284 1.2048 .8483 1.7423 a .077 .077 0 0 0 .088 .0463 c .627 - .2492 1.2246 - .5284 1.7847 - .8578
        a .077 .077 0 0 0 .0521 -.0868 c-.019 -.1482 -.0435 -.2964 -.0648 -.4446 a .077 .077 0 0 0 -.088 -.0648 c -1.2432 .2856 -2.4474 .634 -3.58 .992 a .077 .077 0 0 0 -.0435 .0868 c .388 .7968 .902 1.547 1.5248 2.2239 a .077 .077 0 0 0 .088 .0276 c 1.4816 - .7651 2.8462 - 1.6646 4.0777 - 2.6535
        a .077 .077 0 0 0 .019 -.0868 c -1.1559 -1.231 -1.4344 -2.5955 -1.4344 -2.5955 s .2492 .1482 .742 .4446a 19.9609 19.9609 0 0 0 5.6297 0 c .4928 -.2964 .742 -.4446 .742 -.4446 s -.2785 1.3645 -1.4344 2.5955 a .077 .077 0 0 0 .019 .0868 c 1.2315 .9889 2.5955 1.8884 4.0777 2.6535
        a .077 .077 0 0 0 .088 -.0276 c .6228 -.6769 1.1368 -1.4271 1.5248 -2.2239 a .077 .077 0 0 0 -.0435 -.0868 c -1.1326 -.358 -2.3368 -.7064 -3.58 -.992 a .077 .077 0 0 0 -.088 .0648 c -.0213 .1482 -.0435 .2964 -.0648 .4446 a .077 .077 0 0 0 .0521 .0868
        c .5601 .3294 1.1577 .6086 1.7847 .8578 a .077 .077 0 0 0 .088 -.0463 c .3199 -.5375 .6183 -1.1309 .8483 -1.7423 a .077 .077 0 0 0 -.019 -.0648 c -.01 .009 -.019 .0185 -.0276 .0276 c -.3383 .1964 -.7062 .3848 -1.1035 .5628
        a .077 .077 0 0 0 -.0435 .106 c .2308 .3344 .52 .621 .8198 .8972 a .077 .077 0 0 0 .088 .01 c .3987 -.2914 .8451 -.5998 1.2917 -.9346 a .077 .077 0 0 0 .0276 -.0868 c -.5836 -2.1893 -2.058 -4.323 -4.6318 -6.0963 Z M 8.0203 15.112 c -1.1853 0 -2.1581 -1.0857 -2.1581 -2.4214
        c 0 -1.3357 1.0023 -2.4214 2.1581 -2.4214 c 1.1559 0 2.1286 1.0857 2.1286 2.4214 C 10.149 14.0263 9.1762 15.112 8.0203 15.112 Z M 15.9797 15.112 c -1.1853 0 -2.1581 -1.0857 -2.1581 -2.4214 c 0 -1.3357 1.0023 -2.4214 2.1581 -2.4214
        c 1.1559 0 2.1286 1.0857 2.1286 2.4214 C 18.1083 14.0263 17.1356 15.112 15.9797 15.112 Z"/>
    </svg>
);


export default function Login() {
  const { login } = useContext(AppContext);

  const handleLogin = (provider: 'google' | 'discord') => {
    // In a real app, this would trigger the OAuth flow.
    // For this prototype, we'll simulate it by logging in a mock user.
    if (provider === 'google') {
      login('user-2', 'google'); // Anna Nowak as Google user
    } else {
      login('user-1', 'discord'); // Jan Kowalski as Discord user
    }
  };

  return (
    <>
      <DialogHeader className="sr-only">
        <DialogTitle>Login</DialogTitle>
      </DialogHeader>
      <Card className="w-full max-w-md shadow-2xl bg-transparent border-none">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Logo className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl">Witaj w PraktykanciHub</CardTitle>
            <CardDescription>Zaloguj się, aby zarezerwować miejsce i dołączyć do społeczności.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-primary/80 hover:bg-primary text-primary-foreground" onClick={() => handleLogin('google')}>
              <GoogleIcon /> Zaloguj przez Google
            </Button>
            <Button className="w-full bg-primary/80 hover:bg-primary text-primary-foreground" onClick={() => handleLogin('discord')}>
              <DiscordIcon /> Zaloguj przez Discord
            </Button>
          </CardContent>
           <CardFooter className="text-center text-xs text-muted-foreground pt-4">
            <p>Logując się, akceptujesz nasze warunki i politykę prywatności.</p>
          </CardFooter>
      </Card>
    </>
  );
}
