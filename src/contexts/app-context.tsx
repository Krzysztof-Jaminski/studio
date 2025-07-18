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
  weeklyStatus: WeeklyStatus | null;
  portfolio: PortfolioItem[];
  showStatusPrompt: boolean;
  updateWeeklyStatus: (content: string, status: 'draft' | 'published') => void;
  upsertPortfolioItem: (item: PortfolioItem) => void;
  removePortfolioItem: (itemId: string) => void;
  togglePortfolioItemVisibility: (itemId: string) => void;
  allUsers: User[];
  getUserById: (userId: string) => { user: User | null; portfolio: PortfolioItem[] };
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
  allUsers: [],
  getUserById: () => ({ user: null, portfolio: [] }),
});

const MOCK_USER_BASE: Omit<User, 'id' | 'name'> = { email: "john.doe@example.com" };

// Mock data for other users and their portfolios
const MOCK_USERS: User[] = [
    { id: "user-2", name: "Jane Smith", email: "jane.smith@example.com" },
    { id: "user-3", name: "Peter Jones", email: "peter.jones@example.com" },
    { id: "user-4", name: "Mary Williams", email: "mary.williams@example.com" },
];

const MOCK_PORTFOLIOS: Record<string, PortfolioItem[]> = {
    "user-1": [ // Main user's portfolio
        {
            id: 'status-1', type: 'status', title: 'Status Update', weekOf: startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString(),
            description: 'This week I focused on learning the basics of Next.js and state management with React Context. It was challenging but rewarding. I also built out the initial reservation calendar UI.',
            date: new Date().toISOString(), isVisible: true
        },
        {
            id: 'project-1', type: 'project', title: 'My Personal Website',
            description: 'A personal portfolio website to showcase my skills and projects, built with modern web technologies.',
            link: 'https://github.com', technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), isVisible: true
        }
    ],
    "user-2": [
        {
            id: 'project-jane-1', type: 'project', title: 'DataVis Tool', description: 'A tool for visualizing complex datasets using D3.js.',
            link: 'https://github.com', technologies: ['React', 'D3.js', 'Vite'],
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), isVisible: true
        },
         {
            id: 'status-jane-1', type: 'status', title: 'Status - Week 28', weekOf: startOfWeek(new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), { weekStartsOn: 1 }).toISOString(),
            description: 'Finalized the data parsing module and started working on the chart components. Faced some issues with responsive scaling.',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), isVisible: true
        }
    ],
    "user-3": [
         {
            id: 'project-peter-1', type: 'project', title: 'Mobile Game Backend', description: 'Built a scalable backend for a mobile game using Firebase Functions and Firestore.',
            technologies: ['Firebase', 'Node.js', 'TypeScript'],
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(), isVisible: true
        }
    ],
    "user-4": [
        {
            id: 'status-mary-1', type: 'status', title: 'Status - Week 28', weekOf: startOfWeek(new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), { weekStartsOn: 1 }).toISOString(),
            description: 'Researched different authentication strategies for our web app. Presented findings to the team.',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), isVisible: false // Hidden item
        },
        {
            id: 'status-mary-2', type: 'status', title: 'Status - Week 27', weekOf: startOfWeek(new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), { weekStartsOn: 1 }).toISOString(),
            description: 'Onboarding and setup complete. Ready to start contributing to the codebase.',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), isVisible: true
        },
    ],
};


export function AppContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { toast } = useToast();

  const [weeklyStatus, setWeeklyStatus] = useState<WeeklyStatus | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [showStatusPrompt, setShowStatusPrompt] = useState(false);
  
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    // On mount, load all users. In a real app, this would be a fetch.
    if (user) {
        setAllUsers([user, ...MOCK_USERS]);
    } else {
        setAllUsers([]);
    }
  }, [user]);

  useEffect(() => {
    const checkDate = () => {
        const now = new Date();
        if (isFriday(now) && now.getHours() >= 16) {
           setShowStatusPrompt(true);
        } else {
           setShowStatusPrompt(false);
        }
        if (isFriday(now) && now.getHours() >= 18 && weeklyStatus?.status === 'draft') {
            publishStatus();
        }
    };
    checkDate();
    const interval = setInterval(checkDate, 60000);
    return () => clearInterval(interval);
  }, [weeklyStatus]);


  useEffect(() => {
    const interval = setInterval(() => {
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
    }, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const login = (name: string) => {
    const newUser = { ...MOCK_USER_BASE, id: 'user-1', name };
    setUser(newUser);
    const currentWeek = getWeek(new Date(), { weekStartsOn: 1 });
    setWeeklyStatus({ week: currentWeek, content: '', status: 'draft' });
    setPortfolio(MOCK_PORTFOLIOS['user-1'] || []);
    setAllUsers([newUser, ...MOCK_USERS]);
    toast({
      title: "Logged in",
      description: `Welcome back, ${name}!`,
    });
  };

  const logout = () => {
    setUser(null);
    setWeeklyStatus(null);
    setPortfolio([]);
    setAllUsers([]);
  };

  const toggleReservation = (date: Date) => {
    if (!user) return;
    const dateString = format(date, "yyyy-MM-dd");
    const existingReservation = reservations.find((r) => r.date === dateString);

    if (existingReservation && existingReservation.users.includes(user.id)) {
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
  
  const publishStatus = () => {
    if (!weeklyStatus) return;
    const content = weeklyStatus.content.trim() === "" ? "Brak statusu na dany tydzień." : weeklyStatus.content;
    const weekOf = startOfWeek(new Date(), { weekStartsOn: 1 });

    const newPortfolioItem: PortfolioItem = {
      id: `status-${weeklyStatus.week}`, type: 'status', title: `Status - Week ${weeklyStatus.week}`,
      description: content, date: new Date().toISOString(), weekOf: weekOf.toISOString(), isVisible: true,
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
    setWeeklyStatus({ ...weeklyStatus, content });
    if (status === 'published') {
        publishStatus();
    } else {
        toast({ title: "Draft Saved", description: "Your status has been saved as a draft." });
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
    toast({ title: "Portfolio Updated", description: `"${item.title}" has been saved.` });
  };

  const removePortfolioItem = (itemId: string) => {
    setPortfolio(prev => prev.filter(p => p.id !== itemId));
    toast({ variant: 'destructive', title: "Item Removed", description: "The item has been removed from your portfolio." });
  };
  
  const togglePortfolioItemVisibility = (itemId: string) => {
    setPortfolio(prev =>
        prev.map(p =>
            p.id === itemId ? { ...p, isVisible: !p.isVisible } : p
        )
    );
  };
  
  const getUserById = (userId: string) => {
    const foundUser = [user, ...MOCK_USERS].find(u => u?.id === userId);
    const userPortfolio = MOCK_PORTFOLIOS[userId] || [];
    // for the logged-in user, return their current portfolio state
    if (userId === user?.id) {
        return { user: foundUser || null, portfolio: portfolio };
    }
    return { user: foundUser || null, portfolio: userPortfolio };
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
        allUsers,
        getUserById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
