"use client";

import { createContext, useState, useEffect, type ReactNode } from "react";
import { type User, type Reservation, type WeeklyStatus, type PortfolioItem } from "@/lib/types";
import { format, getWeek, isFriday, startOfWeek } from "date-fns";
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
  // New State
  weeklyStatus: WeeklyStatus | null;
  portfolio: PortfolioItem[];
  showStatusPrompt: boolean;
  // New Functions
  updateWeeklyStatus: (content: string, status: 'draft' | 'published') => void;
  upsertPortfolioItem: (item: PortfolioItem) => void;
  removePortfolioItem: (itemId: string) => void;
  togglePortfolioItemVisibility: (itemId: string) => void;
};

export const AppContext = createContext<AppContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  reservations: [],
  toggleReservation: () => {},
  toggleAllReservations: () => {},
  getUserReservations: () => [],
  weeklyStatus: null,
  portfolio: [],
  showStatusPrompt: false,
  updateWeeklyStatus: () => {},
  upsertPortfolioItem: () => {},
  removePortfolioItem: () => {},
  togglePortfolioItemVisibility: () => {},
});

const MOCK_USER: User = { id: "user-1", name: "John Doe", email: "john.doe@example.com" };

// Mock data for portfolio
const MOCK_PORTFOLIO: PortfolioItem[] = [
    {
        id: 'status-1',
        type: 'status',
        title: 'Status Update',
        weekOf: startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString(),
        description: 'This week I focused on learning the basics of Next.js and state management with React Context. It was challenging but rewarding. I also built out the initial reservation calendar UI.',
        date: new Date().toISOString(),
        isVisible: true
    },
    {
        id: 'project-1',
        type: 'project',
        title: 'My Personal Website',
        description: 'A personal portfolio website to showcase my skills and projects, built with modern web technologies.',
        link: 'https://github.com',
        technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        isVisible: true
    }
];


export function AppContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { toast } = useToast();

  // New state for weekly status and portfolio
  const [weeklyStatus, setWeeklyStatus] = useState<WeeklyStatus | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [showStatusPrompt, setShowStatusPrompt] = useState(false);

  // Effect to manage weekly status prompt visibility
  useEffect(() => {
    const checkDate = () => {
        const now = new Date();
        // Show prompt on Fridays after 16:00
        if (isFriday(now) && now.getHours() >= 16) {
           setShowStatusPrompt(true);
        } else {
           setShowStatusPrompt(false);
        }

        // Auto-publish at 18:00 on Friday
        if (isFriday(now) && now.getHours() >= 18 && weeklyStatus?.status === 'draft') {
            publishStatus();
        }
    };
    
    // Check immediately and then every minute
    checkDate();
    const interval = setInterval(checkDate, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [weeklyStatus]);


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
    // Initialize status and portfolio
    const currentWeek = getWeek(new Date(), { weekStartsOn: 1 });
    setWeeklyStatus({ week: currentWeek, content: '', status: 'draft' });
    setPortfolio(MOCK_PORTFOLIO);
    toast({
      title: "Logged in",
      description: `Welcome back, ${name}!`,
    });
  };

  const logout = () => {
    setUser(null);
    setWeeklyStatus(null);
    setPortfolio([]);
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

  // --- New functions for Status and Portfolio ---
  
  const publishStatus = () => {
    if (!weeklyStatus) return;

    const content = weeklyStatus.content.trim() === "" ? "Brak statusu na dany tydzień." : weeklyStatus.content;
    const weekOf = startOfWeek(new Date(), { weekStartsOn: 1 });

    const newPortfolioItem: PortfolioItem = {
      id: `status-${weeklyStatus.week}`,
      type: 'status',
      title: `Status - Week ${weeklyStatus.week}`,
      description: content,
      date: new Date().toISOString(),
      weekOf: weekOf.toISOString(),
      isVisible: true,
    };

    setPortfolio(prev => [newPortfolioItem, ...prev.filter(p => p.id !== newPortfolioItem.id)]);
    setWeeklyStatus(prev => prev ? { ...prev, status: 'published' } : null);
    
    toast({
        title: "Status Published!",
        description: "Your weekly status has been added to your portfolio.",
    });
  }

  const updateWeeklyStatus = (content: string, status: 'draft' | 'published') => {
    if (!weeklyStatus) return;
    
    setWeeklyStatus({ ...weeklyStatus, content, status });

    if (status === 'published') {
        publishStatus();
    } else {
        toast({
            title: "Draft Saved",
            description: "Your status has been saved as a draft."
        });
    }
  };

  const upsertPortfolioItem = (item: PortfolioItem) => {
    setPortfolio(prev => {
        const existing = prev.find(p => p.id === item.id);
        if (existing) {
            return prev.map(p => p.id === item.id ? item : p);
        }
        return [item, ...prev];
    });
    toast({
        title: "Portfolio Updated",
        description: `"${item.title}" has been saved.`
    });
  };

  const removePortfolioItem = (itemId: string) => {
    setPortfolio(prev => prev.filter(p => p.id !== itemId));
    toast({
        variant: 'destructive',
        title: "Item Removed",
        description: "The item has been removed from your portfolio."
    });
  };
  
  const togglePortfolioItemVisibility = (itemId: string) => {
    setPortfolio(prev =>
        prev.map(p =>
            p.id === itemId ? { ...p, isVisible: !p.isVisible } : p
        )
    );
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
        weeklyStatus,
        portfolio,
        showStatusPrompt,
        updateWeeklyStatus,
        upsertPortfolioItem,
        removePortfolioItem,
        togglePortfolioItemVisibility,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
