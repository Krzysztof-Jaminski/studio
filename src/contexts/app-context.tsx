"use client";

import { createContext, useState, useEffect, type ReactNode } from "react";
import { type User, type Reservation } from "@/lib/types";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { MAX_SPOTS } from "@/lib/utils";

type AppContextType = {
  user: User | null;
  login: (name: string) => void;
  logout: () => void;
  reservations: Reservation[];
  toggleReservation: (date: Date) => void;
  toggleAllReservations: (dates: Date[]) => void;
  getUserReservations: (userId: string) => Reservation[];
};

export const AppContext = createContext<AppContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  reservations: [],
  toggleReservation: () => {},
  toggleAllReservations: () => {},
  getUserReservations: () => [],
});

const MOCK_USER: User = { id: "user-1", name: "John Doe", email: "john.doe@example.com" };

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { toast } = useToast();

  // Simulate real-time updates from a backend
  useEffect(() => {
    const interval = setInterval(() => {
      // Don't update if user is not logged in
      if (!user) return;

      setReservations(prev => {
        const today = new Date();
        const dayToUpdate = new Date(today.setDate(today.getDate() + Math.floor(Math.random() * 5)));
        const dateString = format(dayToUpdate, "yyyy-MM-dd");

        const res = prev.find(r => r.date === dateString);
        if (res && res.users.length < MAX_SPOTS && !res.users.includes('user-ai')) {
          return prev.map(r => r.date === dateString ? { ...r, users: [...r.users, 'user-ai'] } : r);
        } else if (!res) {
          return [...prev, { date: dateString, users: ['user-ai'] }]
        }
        return prev;
      });
    }, 15000); // Every 15 seconds, a random AI user books a spot
    return () => clearInterval(interval);
  }, [user]);

  const login = (name: string) => {
    const newUser = { ...MOCK_USER, name };
    setUser(newUser);
    toast({
      title: "Logged in",
      description: `Welcome back, ${name}!`,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const toggleReservation = (date: Date) => {
    if (!user) return;

    const dateString = format(date, "yyyy-MM-dd");
    const existingReservation = reservations.find((r) => r.date === dateString);

    if (existingReservation && existingReservation.users.includes(user.id)) {
      // Cancel reservation
      setReservations(
        reservations.map((r) =>
          r.date === dateString
            ? { ...r, users: r.users.filter((id) => id !== user.id) }
            : r
        )
      );
      toast({
        title: "Reservation Cancelled",
        description: `Your spot for ${format(date, "MMMM d")} has been cancelled.`,
      });
    } else {
      // Make new reservation
      if (existingReservation && existingReservation.users.length >= MAX_SPOTS) {
        toast({
          variant: "destructive",
          title: "Booking Failed",
          description: `Sorry, all spots for ${format(date, "MMMM d")} are taken.`,
        });
        return;
      }

      if (existingReservation) {
        setReservations(
          reservations.map((r) =>
            r.date === dateString ? { ...r, users: [...r.users, user.id] } : r
          )
        );
      } else {
        setReservations([...reservations, { date: dateString, users: [user.id] }]);
      }
      toast({
        title: "Reservation Confirmed!",
        description: `You have booked a spot for ${format(date, "MMMM d")}.`,
      });
    }
  };

  const toggleAllReservations = (dates: Date[]) => {
    if (!user) return;

    let updatedReservations = [...reservations];
    let newBookings = 0;

    dates.forEach(date => {
        const dateString = format(date, "yyyy-MM-dd");
        const res = updatedReservations.find(r => r.date === dateString);
        
        if (!res || (res.users.length < MAX_SPOTS && !res.users.includes(user.id))) {
            if (res) {
                updatedReservations = updatedReservations.map(r => r.date === dateString ? { ...r, users: [...r.users, user.id] } : r);
            } else {
                updatedReservations.push({ date: dateString, users: [user.id] });
            }
            newBookings++;
        }
    });

    setReservations(updatedReservations);
    if(newBookings > 0) {
        toast({
            title: "Reservations Updated",
            description: `You have booked spots for ${newBookings} available day(s).`,
        });
    } else {
        toast({
            title: "No new bookings",
            description: "All available days were already booked by you or are full.",
        });
    }
  };


  const getUserReservations = (userId: string) => {
    return reservations.filter((r) => r.users.includes(userId));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        reservations,
        toggleReservation,
        toggleAllReservations,
        getUserReservations,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
