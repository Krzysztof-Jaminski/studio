
"use client";

import { useContext } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppContext } from "@/contexts/app-context";
import { Logo } from './icons';
import { DialogHeader } from './ui/dialog';

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
    <svg className="mr-2 h-5 w-5" fill="#5865F2" viewBox="0 0 28 21" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.021 1.629C21.31 0.61 19.465 0 17.5 0C17.5 0 17.438 0.063 17.376 0.126C15.39 1.94 14.015 3.896 13.985 3.958C11.514 3.313 9.043 3.313 6.572 3.958C6.542 3.896 5.167 1.94 3.125 0.126C3.063 0.063 3 0 3 0C1.036 0 0.128 0.58 0.128 0.58C0.128 0.58 -0.015 2.14 0.001 4.2C0.032 6.816 1.637 9.247 3.84 10.468C3.84 10.468 4.62 9.89 5.244 9.405C4.336 8.56 3.614 7.55 3.155 6.46C3.125 6.398 3.155 6.335 3.186 6.335C3.216 6.335 3.247 6.367 3.277 6.398C5.55 8.12 8.337 8.9 11.124 8.9H11.25C14.037 8.9 16.824 8.12 19.128 6.398C19.158 6.367 19.188 6.335 19.219 6.335C19.281 6.335 19.281 6.398 19.281 6.49C18.822 7.58 18.07 8.59 17.193 9.405C17.786 9.89 18.597 10.468 18.597 10.468C20.832 9.247 22.406 6.816 22.437 4.2C22.468 2.14 22.325 0.58 22.325 0.58C22.325 0.58 21.418 0 19.453 0C19.453 0 19.423 0.03 19.392 0.062C17.84 1.278 16.643 2.585 15.98 3.442C15.98 3.442 15.44 3.66 15.013 3.854L15.044 3.885C15.013 3.916 14.015 3.896 13.985 3.958ZM9.215 6.553C8.245 6.553 7.434 5.71 7.434 4.708C7.434 3.707 8.245 2.863 9.215 2.863C10.185 2.863 11 3.707 10.97 4.708C10.97 5.71 10.185 6.553 9.215 6.553ZM16.222 6.553C15.252 6.553 14.441 5.71 14.441 4.708C14.441 3.707 15.252 2.863 16.222 2.863C17.192 2.863 18 3.707 17.97 4.708C17.97 5.71 17.192 6.553 16.222 6.553Z" />
    </svg>
);


const MicrosoftIcon = () => (
    <svg className="mr-2 h-5 w-5" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1H10.2321V10.2321H1V1Z" fill="#F25022"/>
        <path d="M12.7679 1H22V10.2321H12.7679V1Z" fill="#7FBA00"/>
        <path d="M1 12.7679H10.2321V22H1V12.7679Z" fill="#00A4EF"/>
        <path d="M12.7679 12.7679H22V22H12.7679V12.7679Z" fill="#FFB900"/>
    </svg>
);


export default function Login() {
  const { login } = useContext(AppContext);

  const handleLogin = (provider: 'google' | 'discord' | 'microsoft') => {
    // In a real app, this would trigger the OAuth flow.
    // For this prototype, we'll simulate it by logging in a mock user.
    if (provider === 'google') {
      login('user-2', 'google'); // Anna Nowak as Google user
    } else if (provider === 'microsoft') {
        login('user-3', 'microsoft'); // Piotr Zieliński as Microsoft user
    } else {
      login('user-1', 'discord'); // Jan Kowalski as Discord user
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="sr-only">Login</DialogTitle>
      </DialogHeader>
      <Card className="w-full max-w-md shadow-2xl bg-transparent border-none">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Logo className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl">Witaj w Praktykanci<span className="text-primary">Hub</span>!</CardTitle>
            <CardDescription>Zaloguj się, aby zarezerwować miejsce i dołączyć do społeczności.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="glass" className="w-full" onClick={() => handleLogin('google')}>
              <GoogleIcon /> Zaloguj przez Google
            </Button>
            <Button variant="glass" className="w-full" onClick={() => handleLogin('discord')}>
              <DiscordIcon /> Zaloguj przez Discord
            </Button>
            <Button variant="glass" className="w-full" onClick={() => handleLogin('microsoft')}>
              <MicrosoftIcon /> Zaloguj przez Microsoft
            </Button>
          </CardContent>
           <CardFooter className="pt-4 flex justify-center">
            <p className="text-xs text-muted-foreground text-center">Logując się, akceptujesz nasze warunki i politykę prywatności.</p>
          </CardFooter>
      </Card>
    </>
  );
}
