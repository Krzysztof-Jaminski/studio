
"use client";

import { createContext, useState, useEffect, type ReactNode } from "react";
import { type User, type Reservation, type WeeklyStatus, type PortfolioItem, type FoodOrder, type OrderItem, type OrderItemData, type VotingOption } from "@/lib/types";
import { format, startOfWeek, getDay, isAfter, endOfDay, differenceInWeeks } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { MAX_SPOTS } from "@/lib/utils";

type AppContextType = {
  user: User | null;
  login: (name: string) => void;
  logout: () => void;
  reservations: Reservation[];
  toggleReservation: (date: Date, type: 'office' | 'online') => void;
  weeklyStatus: WeeklyStatus | null;
  portfolio: PortfolioItem[];
  showStatusPrompt: boolean;
  updateWeeklyStatus: (content: string, status: 'draft' | 'published') => void;
  upsertPortfolioItem: (item: PortfolioItem) => void;
  removePortfolioItem: (itemId: string) => void;
  togglePortfolioItemVisibility: (itemId: string) => void;
  allUsers: User[];
  getUserById: (userId: string) => { user: User | null; portfolio: PortfolioItem[] };
  foodOrders: FoodOrder[];
  addFoodOrder: (order: Omit<FoodOrder, 'id' | 'creatorId' | 'orders' | 'isOpen' | 'votingOptions'> & { votingOptions?: { name: string, link: string, imageUrl?: string }[] }) => void;
  removeFoodOrder: (orderId: string) => void;
  addOrderItem: (orderId: string, item: OrderItemData) => void;
  removeOrderItem: (orderId: string, itemId: string) => void;
  togglePaidStatus: (orderId: string, itemId: string | 'all') => void;
  toggleOrderState: (orderId: string) => void;
  toggleVote: (eventId: string, optionId: string) => void;
};

export const AppContext = createContext<AppContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  reservations: [],
  toggleReservation: () => {},
  weeklyStatus: null,
  portfolio: [],
  showStatusPrompt: false,
  updateWeeklyStatus: () => {},
  upsertPortfolioItem: () => {},
  removePortfolioItem: () => {},
  togglePortfolioItemVisibility: () => {},
  allUsers: [],
  getUserById: () => ({ user: null, portfolio: [] }),
  foodOrders: [],
  addFoodOrder: () => {},
  removeFoodOrder: () => {},
  addOrderItem: () => {},
  removeOrderItem: () => {},
  togglePaidStatus: () => {},
  toggleOrderState: () => {},
  toggleVote: () => {},
});

const INTERNSHIP_START_DATE = new Date('2025-07-07');

const INITIAL_USERS: User[] = [
    { id: "user-1", name: "John Doe", email: "john.doe@example.com", role: "user" },
    { id: "user-2", name: "Jane Smith", email: "jane.smith@example.com", role: "user" },
    { id: "user-3", name: "Peter Jones", email: "peter.jones@example.com", role: "user" },
    { id: "user-4", name: "Mary Williams", email: "mary.williams@example.com", role: "user" },
    { id: "admin1", name: "Admin User", email: "admin@example.com", role: "admin" },
];

const MOCK_PORTFOLIOS: Record<string, PortfolioItem[]> = {
    "user-1": [
        {
            id: 'status-1', type: 'status', title: 'Status Update', weekOf: startOfWeek(INTERNSHIP_START_DATE, { weekStartsOn: 1 }).toISOString(),
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
            id: 'status-jane-1', type: 'status', title: 'Status - Week 2', weekOf: startOfWeek(new Date(INTERNSHIP_START_DATE.getTime() + 1000 * 60 * 60 * 24 * 7), { weekStartsOn: 1 }).toISOString(),
            description: 'Finalized the data parsing module and started working on the chart components. Faced some issues with responsive scaling.',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), isVisible: true
        }
    ],
    "user-3": [],
    "user-4": [],
    "admin1": [],
};

const MOCK_FOOD_ORDERS: FoodOrder[] = [
    {
        id: 'fo-1',
        type: 'order',
        creatorId: 'user-2',
        companyName: 'Pizza Heaven',
        link: 'https://example.com',
        creatorPhoneNumber: '123-456-789',
        imageUrl: 'https://placehold.co/100x100.png',
        isOpen: true,
        orders: [
            { id: 'item-1', userId: 'user-2', name: 'Margherita', details: 'Large', price: 15.99, isPaid: true },
            { id: 'item-2', userId: 'user-3', name: 'Pepperoni', details: 'Medium, extra cheese', price: 17.50, isPaid: false },
        ]
    },
    {
        id: 'fo-2',
        type: 'order',
        creatorId: 'user-1',
        companyName: 'Sushi World',
        link: 'https://example.com',
        creatorPhoneNumber: '987-654-321',
        imageUrl: 'https://placehold.co/100x100.png',
        isOpen: false,
        orders: [
            { id: 'item-3', userId: 'user-1', name: 'California Roll', details: '', price: 8.00, isPaid: true },
            { id: 'item-4', userId: 'user-4', name: 'Spicy Tuna Roll', details: '', price: 9.50, isPaid: true },
        ]
    },
    {
        id: 'vo-1',
        type: 'voting',
        creatorId: 'admin1',
        companyName: 'Friday Lunch Vote', // Here companyName is used as the voting title
        isOpen: true,
        votingOptions: [
            { id: 'opt-1', name: 'Mexican Grill', link: 'https://example.com', imageUrl: 'https://placehold.co/100x100.png', votes: ['user-1', 'user-4'] },
            { id: 'opt-2', name: 'Italian Pasta', link: 'https://example.com', imageUrl: 'https://placehold.co/100x100.png', votes: ['user-2'] },
            { id: 'opt-3', name: 'Thai Corner', link: 'https://example.com', imageUrl: 'https://placehold.co/100x100.png', votes: ['user-1', 'user-2', 'user-3'] },
        ]
    }
];


export function AppContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { toast } = useToast();

  const [weeklyStatus, setWeeklyStatus] = useState<WeeklyStatus | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [showStatusPrompt, setShowStatusPrompt] = useState(false);
  const [foodOrders, setFoodOrders] = useState<FoodOrder[]>(MOCK_FOOD_ORDERS);
  
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [userPortfolios, setUserPortfolios] = useState<Record<string, PortfolioItem[]>>(MOCK_PORTFOLIOS);


  useEffect(() => {
    const checkDate = () => {
        const now = new Date();
        const endOfFriday = endOfDay(now);
        // Show prompt all of Friday.
        if (getDay(now) === 5) {
           setShowStatusPrompt(true);
        } else {
           setShowStatusPrompt(false);
        }
        
        // Auto-publish logic
        const startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
        const statusForCurrentWeekExists = portfolio.some(item => item.type === 'status' && item.weekOf === startOfThisWeek.toISOString());

        // Auto-publish on Saturday morning if draft exists
        if (getDay(now) === 6 && weeklyStatus?.status === 'draft' && !statusForCurrentWeekExists) {
            publishStatus();
        }
    };
    checkDate();
    const interval = setInterval(checkDate, 60000); // check every minute
    return () => clearInterval(interval);
  }, [weeklyStatus, portfolio]);


  const login = (name: string) => {
    let potentialUser = allUsers.find(u => u.name.toLowerCase() === name.toLowerCase());

    if (!potentialUser) {
        const newUser: User = {
            id: `user-${Date.now()}`,
            name: name,
            email: `${name.replace(/\s+/g, '.').toLowerCase()}@example.com`,
            role: 'user'
        };
        setAllUsers(prev => [...prev, newUser]);
        setUserPortfolios(prev => ({...prev, [newUser.id]: [] }));
        potentialUser = newUser;
    }

    setUser(potentialUser);
    const userPortfolio = userPortfolios[potentialUser.id] || [];
    setPortfolio(userPortfolio);
    
    // Check for existing status for the current week
    const weekStartISO = startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();
    const existingStatus = userPortfolio.find(item => item.type === 'status' && item.weekOf === weekStartISO);
    
    const startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    const currentWeekNumber = differenceInWeeks(startOfThisWeek, startOfWeek(INTERNSHIP_START_DATE, { weekStartsOn: 1 })) + 1;


    if (existingStatus) {
        setWeeklyStatus({
            week: currentWeekNumber,
            content: existingStatus.description,
            status: 'published'
        });
    } else {
        setWeeklyStatus({ week: currentWeekNumber, content: '', status: 'draft' });
    }
    
    toast({
      title: "Logged in",
      description: `Welcome back, ${potentialUser.name}!`,
    });
  };

  const logout = () => {
    setUser(null);
    setWeeklyStatus(null);
    setPortfolio([]);
  };

  const toggleReservation = (date: Date, type: 'office' | 'online') => {
    if (!user) return;
    const dateString = format(date, "yyyy-MM-dd");
    let res = reservations.find((r) => r.date === dateString);
    let userBooking: 'office' | 'online' | null = null;
    
    if (res) {
        if (res.office.includes(user.id)) userBooking = 'office';
        if (res.online.includes(user.id)) userBooking = 'online';
    }

    if (userBooking) { // User is canceling or changing booking
        // If user clicks the same booking type, cancel it
        if (userBooking === type) {
            const updatedReservations = reservations.map(r => {
                if (r.date === dateString) {
                    return {
                        ...r,
                        office: r.office.filter(id => id !== user.id),
                        online: r.online.filter(id => id !== user.id),
                    }
                }
                return r;
            });
            setReservations(updatedReservations.filter(r => r.office.length > 0 || r.online.length > 0));
            toast({
                title: "Reservation Cancelled",
                description: `Your spot for ${format(date, "MMMM d")} has been cancelled.`,
            });
            return;
        } else { // User is changing from one type to another
             // First check for availability if switching to office
            if (type === 'office' && res && res.office.length >= MAX_SPOTS) {
                toast({
                  variant: "destructive",
                  title: "Booking Failed",
                  description: `Sorry, all office spots for ${format(date, "MMMM d")} are taken.`,
                });
                return;
            }
             const updatedReservations = reservations.map(r => {
                if (r.date === dateString) {
                    return {
                        ...r,
                        office: type === 'office' ? [...r.office.filter(id => id !== user.id), user.id] : r.office.filter(id => id !== user.id),
                        online: type === 'online' ? [...r.online.filter(id => id !== user.id), user.id] : r.online.filter(id => id !== user.id),
                    }
                }
                return r;
            });
            setReservations(updatedReservations);
            toast({
                title: "Reservation Changed!",
                description: `You are now booked for an ${type} spot for ${format(date, "MMMM d")}.`,
            });
            return;
        }
    }
    
    // This is a new booking
    if (type === 'office' && res && res.office.length >= MAX_SPOTS) {
        toast({
          variant: "destructive",
          title: "Booking Failed",
          description: `Sorry, all office spots for ${format(date, "MMMM d")} are taken.`,
        });
        return;
    }

    const newReservationData = {
        office: type === 'office' ? [user.id] : [],
        online: type === 'online' ? [user.id] : [],
    };

    if (res) {
        setReservations(
          reservations.map((r) =>
            r.date === dateString ? { ...r, office: [...r.office, ...newReservationData.office], online: [...r.online, ...newReservationData.online] } : r
          )
        );
    } else {
        setReservations([...reservations, { date: dateString, office: newReservationData.office, online: newReservationData.online }]);
    }
    
    toast({
        title: "Reservation Confirmed!",
        description: `You have booked an ${type} spot for ${format(date, "MMMM d")}.`,
    });
  };

  const publishStatus = () => {
    if (!user) return;
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekNumber = differenceInWeeks(weekStart, startOfWeek(INTERNSHIP_START_DATE, { weekStartsOn: 1 })) + 1;
    
    const content = weeklyStatus?.content.trim() === "" ? "Brak statusu na dany tydzień." : weeklyStatus?.content || "Brak statusu na dany tydzień.";

    const newPortfolioItem: PortfolioItem = {
      id: `status-${user.id}-${weekStart.toISOString()}`, type: 'status', title: `Status - Week ${weekNumber}`,
      description: content, date: new Date().toISOString(), weekOf: weekStart.toISOString(), isVisible: true,
    };

    upsertPortfolioItem(newPortfolioItem);
    setWeeklyStatus(prev => prev ? { ...prev, content: content, status: 'published' } : null);
    
    toast({
        title: "Status Published!",
        description: "Your weekly status has been added to your portfolio.",
    });
  }

  const updateWeeklyStatus = (content: string, status: 'draft' | 'published') => {
    if (!user) return;
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekNumber = differenceInWeeks(weekStart, startOfWeek(INTERNSHIP_START_DATE, { weekStartsOn: 1 })) + 1;

    if (status === 'published') {
        const newPortfolioItem: PortfolioItem = {
            id: `status-${user.id}-${weekStart.toISOString()}`,
            type: 'status',
            title: `Status - Week ${weekNumber}`,
            description: content,
            date: new Date().toISOString(),
            weekOf: weekStart.toISOString(),
            isVisible: true,
        };
        upsertPortfolioItem(newPortfolioItem);
        setWeeklyStatus({ week: weekNumber, content, status: 'published' });
    } else {
        setWeeklyStatus({ week: weekNumber, content, status: 'draft' });
        toast({ title: "Draft Saved", description: "Your status has been saved as a draft." });
    }
  };


  const upsertPortfolioItem = (item: PortfolioItem) => {
    if (!user) return;
    const updatedPortfolio = (() => {
        const existing = portfolio.find(p => p.id === item.id);
        if (existing) {
            return portfolio.map(p => p.id === item.id ? item : p);
        }
        return [item, ...portfolio];
    })();
    setPortfolio(updatedPortfolio);
    setUserPortfolios(prev => ({...prev, [user.id]: updatedPortfolio}));
    toast({ title: "Portfolio Updated", description: `"${item.title}" has been saved.` });
  };

  const removePortfolioItem = (itemId: string) => {
    if (!user) return;
    const updatedPortfolio = portfolio.filter(p => p.id !== itemId);
    setPortfolio(updatedPortfolio);
    setUserPortfolios(prev => ({...prev, [user.id]: updatedPortfolio}));
    toast({ variant: 'destructive', title: "Item Removed", description: "The item has been removed from your portfolio." });
  };
  
  const togglePortfolioItemVisibility = (itemId: string) => {
    if (!user) return;
    const updatedPortfolio = portfolio.map(p =>
        p.id === itemId ? { ...p, isVisible: !p.isVisible } : p
    );
    setPortfolio(updatedPortfolio);
    setUserPortfolios(prev => ({...prev, [user.id]: updatedPortfolio}));
  };
  
  const getUserById = (userId: string) => {
    const foundUser = allUsers.find(u => u?.id === userId);
    const userPortfolio = userPortfolios[userId] || [];
    return { user: foundUser || null, portfolio: userPortfolio };
  };

  // Food Order Functions
  const addFoodOrder = (orderData: Omit<FoodOrder, 'id' | 'creatorId' | 'orders' | 'isOpen' | 'votingOptions'> & { votingOptions?: { name: string, link: string, imageUrl?: string }[] }) => {
    if (!user) return;
    
    let newEvent: FoodOrder;
    const baseEvent = {
        id: `evt-${Date.now()}`,
        creatorId: user.id,
        companyName: orderData.companyName,
        isOpen: true,
    };

    if (orderData.type === 'voting') {
        newEvent = {
            ...baseEvent,
            type: 'voting',
            votingOptions: orderData.votingOptions?.map((opt, index) => ({
                id: `opt-${Date.now()}-${index}`,
                name: opt.name,
                link: opt.link,
                imageUrl: opt.imageUrl || 'https://placehold.co/100x100.png',
                votes: [],
            }))
        };
    } else { // 'order'
        newEvent = {
            ...baseEvent,
            type: 'order',
            link: orderData.link,
            creatorPhoneNumber: orderData.creatorPhoneNumber,
            imageUrl: orderData.imageUrl || 'https://placehold.co/100x100.png',
            orders: [],
        };
    }

    setFoodOrders(prev => [newEvent, ...prev]);
    toast({ title: "Event Created!", description: `The "${orderData.companyName}" event is now live.` });
  };

  const removeFoodOrder = (orderId: string) => {
    if (user?.role !== 'admin') {
      toast({ variant: 'destructive', title: 'Permission Denied', description: 'Only an admin can delete an order event.' });
      return;
    }
    setFoodOrders(prev => prev.filter(order => order.id !== orderId));
    toast({ variant: 'destructive', title: "Event Removed", description: "The entire food event has been deleted." });
  };

  const addOrderItem = (orderId: string, itemData: OrderItemData) => {
    if (!user) return;
    const newItem: OrderItem = {
        ...itemData,
        id: `item-${Date.now()}`,
        userId: user.id,
        isPaid: false,
    };
    setFoodOrders(prev => prev.map(order => {
        if (order.id === orderId && order.type === 'order') {
            return { ...order, orders: [...(order.orders || []), newItem] };
        }
        return order;
    }));
    toast({ title: "Order Added", description: `Your order for "${itemData.name}" has been placed.` });
  };

  const removeOrderItem = (orderId: string, itemId: string) => {
    setFoodOrders(prev => prev.map(order => {
        if (order.id === orderId && order.type === 'order') {
            const itemToRemove = order.orders?.find(item => item.id === itemId);
            if (!itemToRemove) return order;
            // Admin can remove any, creator can remove any, user can only remove their own
            if (user?.role !== 'admin' && user?.id !== order.creatorId && user?.id !== itemToRemove.userId) {
                toast({ variant: 'destructive', title: "Permission Denied" });
                return order;
            }
            return { ...order, orders: order.orders?.filter(item => item.id !== itemId) };
        }
        return order;
    }));
    toast({ variant: 'destructive', title: "Order Item Removed" });
  };
  
  const togglePaidStatus = (orderId: string, itemId: string | 'all') => {
      setFoodOrders(prev => prev.map(order => {
          if (order.id === orderId && order.type === 'order') {
              if (user?.id !== order.creatorId && user?.role !== 'admin') {
                  toast({ variant: 'destructive', title: "Permission Denied", description: "Only the creator or an admin can manage payments." });
                  return order;
              }
              const newOrders = order.orders?.map(item => {
                  if (itemId === 'all') {
                      return { ...item, isPaid: true };
                  }
                  if (item.id === itemId) {
                      return { ...item, isPaid: !item.isPaid };
                  }
                  return item;
              });
              return { ...order, orders: newOrders };
          }
          return order;
      }));
  };

  const toggleOrderState = (orderId: string) => {
      setFoodOrders(prev => prev.map(order => {
          if (order.id === orderId) {
               if (user?.id !== order.creatorId && user?.role !== 'admin') {
                  toast({ variant: 'destructive', title: "Permission Denied", description: "Only the creator or an admin can close the event." });
                  return order;
              }
              toast({ title: "Event State Changed", description: `The event is now ${!order.isOpen ? 'open' : 'closed'}.` });
              return { ...order, isOpen: !order.isOpen };
          }
          return order;
      }));
  };

  const toggleVote = (eventId: string, optionId: string) => {
      if (!user) return;
      setFoodOrders(prev => prev.map(event => {
        if (event.id === eventId && event.type === 'voting' && event.isOpen) {
            const newOptions = event.votingOptions?.map(opt => {
                if (opt.id === optionId) {
                    const hasVoted = opt.votes.includes(user.id);
                    if (hasVoted) {
                        return { ...opt, votes: opt.votes.filter(voteId => voteId !== user.id) };
                    } else {
                        return { ...opt, votes: [...opt.votes, user.id] };
                    }
                }
                return opt;
            });
            return { ...event, votingOptions: newOptions };
        }
        return event;
      }));
  }


  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        reservations,
        toggleReservation,
        weeklyStatus,
        portfolio,
        showStatusPrompt,
        updateWeeklyStatus,
        upsertPortfolioItem,
        removePortfolioItem,
        togglePortfolioItemVisibility,
        allUsers,
        getUserById,
        foodOrders,
        addFoodOrder,
        removeFoodOrder,
        addOrderItem,
        removeOrderItem,
        togglePaidStatus,
        toggleOrderState,
        toggleVote,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
