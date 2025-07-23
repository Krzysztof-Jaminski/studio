
"use client";

import { createContext, useState, useEffect, type ReactNode, useRef } from "react";
import { useRouter } from 'next/navigation';
import { type User, type Reservation, type WeeklyStatus, type PortfolioItem, type FoodOrder, type OrderItem, type OrderItemData, type VotingOption } from "@/lib/types";
import { format, startOfWeek, getDay, isAfter, endOfDay, differenceInWeeks, addDays, eachDayOfInterval } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { MAX_SPOTS } from "@/lib/utils";

export type StoredOrderDetails = {
    link?: string;
    creatorPhoneNumber?: string;
};

type NewFoodOrderData = {
    companyName: string;
    description?: string;
    deadline?: string;
} & (
    | { type: 'order', link?: string, creatorPhoneNumber?: string }
    | { type: 'voting', votingOptions: { name: string, link?: string }[] }
);


type AppContextType = {
  user: User | null;
  login: (userId: string, provider: 'google' | 'discord' | 'microsoft') => void;
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
  addFoodOrder: (order: NewFoodOrderData) => void;
  editFoodOrder: (orderId: string, editedData: Omit<FoodOrder, 'id' | 'creatorId' | 'orders' | 'isOpen' | 'type' | 'votingOptions'> & { type: 'order' }) => void;
  removeFoodOrder: (orderId: string) => void;
  addOrderItem: (orderId: string, item: OrderItemData, guestName?: string) => void;
  removeOrderItem: (orderId: string, itemId: string) => void;
  togglePaidStatus: (orderId: string, itemId: string | 'all') => void;
  toggleOrderState: (orderId: string) => void;
  toggleVote: (eventId: string, optionId: string) => void;
  addVotingOption: (eventId: string, optionData: { name: string, link?: string }) => void;
  createOrderFromVote: (eventId: string, optionId: string) => void;
  storedOrderDetails: StoredOrderDetails | null;
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
  editFoodOrder: () => {},
  removeFoodOrder: () => {},
  addOrderItem: () => {},
  removeOrderItem: () => {},
  togglePaidStatus: () => {},
  toggleOrderState: () => {},
  toggleVote: () => {},
  addVotingOption: () => {},
  createOrderFromVote: () => {},
  storedOrderDetails: null,
});

const INTERNSHIP_START_DATE = new Date('2025-07-07');
const INTERNSHIP_END_DATE = new Date('2025-10-01');


const INITIAL_USERS: User[] = [
    { id: "user-1", name: "Jan Kowalski", email: "jan.kowalski@example.com", role: "user", avatarUrl: "https://placehold.co/100x100.png" },
    { id: "user-2", name: "Anna Nowak", email: "anna.nowak@example.com", role: "user", avatarUrl: "https://placehold.co/100x100.png" },
    { id: "user-3", name: "Piotr Zieliński", email: "piotr.zielinski@example.com", role: "user", avatarUrl: "https://placehold.co/100x100.png" },
    { id: "user-4", name: "Maria Wiśniewska", email: "maria.wisniewska@example.com", role: "user", avatarUrl: "https://placehold.co/100x100.png" },
    { id: "admin1", name: "Użytkownik Admin", email: "admin@example.com", role: "admin", avatarUrl: "https://placehold.co/100x100.png" },
];

const seedRandomReservations = (users: User[]): Reservation[] => {
    const reservations: Reservation[] = [];
    const days = eachDayOfInterval({ start: INTERNSHIP_START_DATE, end: INTERNSHIP_END_DATE });

    days.forEach(day => {
        const dayOfWeek = getDay(day);
        if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
            const dateString = format(day, "yyyy-MM-dd");
            const officeUsers: string[] = [];
            const onlineUsers: string[] = [];

            users.forEach(user => {
                const rand = Math.random();
                if (rand < 0.6) { // 60% chance to have a reservation
                    if (rand < 0.35 && officeUsers.length < MAX_SPOTS) { // ~35% chance for office
                        officeUsers.push(user.id);
                    } else { // ~25% chance for online
                        onlineUsers.push(user.id);
                    }
                }
            });

            if (officeUsers.length > 0 || onlineUsers.length > 0) {
                reservations.push({ date: dateString, office: officeUsers, online: onlineUsers });
            }
        }
    });

    return reservations;
};


export function AppContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const isMounted = useRef(false);

  const [weeklyStatus, setWeeklyStatus] = useState<WeeklyStatus | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [showStatusPrompt, setShowStatusPrompt] = useState(false);
  const [foodOrders, setFoodOrders] = useState<FoodOrder[]>([]);
  
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [userPortfolios, setUserPortfolios] = useState<Record<string, PortfolioItem[]>>({});
  const [storedOrderDetails, setStoredOrderDetails] = useState<StoredOrderDetails | null>(null);


  useEffect(() => {
    try {
        const stored = localStorage.getItem('lastOrderDetails');
        if (stored) {
            setStoredOrderDetails(JSON.parse(stored));
        }
    } catch (error) {
        console.error("Failed to read from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (user && isMounted.current) {
        toast({
            title: "Zalogowano",
            description: `Witaj z powrotem, ${user.name}!`,
        });
    } else {
        isMounted.current = true;
    }
  }, [user]);

  useEffect(() => {
    const checkDate = () => {
        const now = new Date();
        const dayOfWeek = getDay(now); // 0 (Sunday) to 6 (Saturday), 5 is Friday
        
        const isFriday = dayOfWeek === 5;
        setShowStatusPrompt(isFriday);
        
        const startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
        const statusForCurrentWeekExists = portfolio.some(item => item.type === 'status' && item.weekOf === startOfThisWeek.toISOString());

        // Auto-publish on Saturday morning if draft exists
        if (getDay(now) === 6 && weeklyStatus?.status === 'draft' && !statusForCurrentWeekExists) {
            publishStatus();
        }
    };

    if (user) {
        checkDate();
        const interval = setInterval(checkDate, 60000); // check every minute
        return () => clearInterval(interval);
    }
  }, [weeklyStatus, portfolio, user]);


  const login = (userId: string, provider: 'google' | 'discord' | 'microsoft') => {
    let potentialUser = allUsers.find(u => u.id === userId);

    if (!potentialUser) {
        const newUser: User = {
            id: userId,
            name: `Użytkownik ${userId}`,
            email: `${userId}@example.com`,
            role: 'user'
        };
        setAllUsers(prev => [...prev, newUser]);
        setUserPortfolios(prev => ({...prev, [newUser.id]: [] }));
        potentialUser = newUser;
    }

    const loggedInUser = {...potentialUser, provider};
    setUser(loggedInUser);

    const userPortfolio = userPortfolios[loggedInUser.id] || [];
    setPortfolio(userPortfolio);
    
    // Seed reservations once on login
    if (reservations.length === 0) {
        setReservations(seedRandomReservations(allUsers));
    }

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
  };

  const logout = () => {
    setUser(null);
    setWeeklyStatus(null);
    setPortfolio([]);
    router.push('/');
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
            title: "Rezerwacja anulowana",
            description: `Twoje miejsce na ${format(date, "d MMMM")} zostało anulowane.`,
        });
        return;
    }

    const reservationsWithoutUser = reservations.map(r => {
        if (r.date === dateString) {
            return {
                ...r,
                office: r.office.filter(id => id !== user.id),
                online: r.online.filter(id => id !== user.id),
            }
        }
        return r;
    }).filter(r => r.office.length > 0 || r.online.length > 0);
    
    res = reservationsWithoutUser.find((r) => r.date === dateString);

    if (type === 'office' && res && res.office.length >= MAX_SPOTS) {
        toast({
          variant: "destructive",
          title: "Rezerwacja nieudana",
          description: `Przepraszamy, wszystkie miejsca w biurze na ${format(date, "d MMMM")} są zajęte.`,
        });
        if (userBooking) { // Revert to previous booking if any
          toggleReservation(date, userBooking as 'office' | 'online');
        }
        return;
    }
    
    if (res) {
         setReservations(
          reservationsWithoutUser.map((r) =>
            r.date === dateString ? { ...r, [type]: [...r[type], user.id] } : r
          )
        );
    } else {
        setReservations([...reservationsWithoutUser, { date: dateString, office: type === 'office' ? [user.id] : [], online: type === 'online' ? [user.id] : [] }]);
    }
    
    toast({
        title: "Rezerwacja potwierdzona!",
        description: `Zarezerwowano miejsce ${type === 'office' ? 'w biurze' : 'online'} na ${format(date, "d MMMM")}.`,
    });
  };

  const publishStatus = () => {
    if (!user) return;
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekNumber = differenceInWeeks(weekStart, startOfWeek(INTERNSHIP_START_DATE, { weekStartsOn: 1 })) + 1;
    
    const content = weeklyStatus?.content.trim() === "" ? "Brak statusu na dany tydzień." : weeklyStatus?.content || "Brak statusu na dany tydzień.";

    const newPortfolioItem: PortfolioItem = {
      id: `status-${user.id}-${weekStart.toISOString()}`, type: 'status', title: `Status - Tydzień ${weekNumber}`,
      description: content, date: new Date().toISOString(), weekOf: weekStart.toISOString(), isVisible: true,
    };

    upsertPortfolioItem(newPortfolioItem);
    setWeeklyStatus(prev => prev ? { ...prev, content: content, status: 'published' } : null);
    
    toast({
        title: "Status opublikowany!",
        description: "Twój tygodniowy status został dodany do portfolio.",
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
            title: `Status - Tydzień ${weekNumber}`,
            description: content,
            date: new Date().toISOString(),
            weekOf: weekStart.toISOString(),
            isVisible: true,
        };
        upsertPortfolioItem(newPortfolioItem);
        setWeeklyStatus({ week: weekNumber, content, status: 'published' });
    } else {
        setWeeklyStatus({ week: weekNumber, content, status: 'draft' });
        toast({ title: "Zapisano wersję roboczą", description: "Twój status został zapisany jako wersja robocza." });
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
    toast({ title: "Portfolio zaktualizowane", description: `"${item.title}" zostało zapisane.` });
  };

  const removePortfolioItem = (itemId: string) => {
    if (!user) return;
    const updatedPortfolio = portfolio.filter(p => p.id !== itemId);
    setPortfolio(updatedPortfolio);
    setUserPortfolios(prev => ({...prev, [user.id]: updatedPortfolio}));
    toast({ title: "Element usunięty", description: "Element został usunięty z Twojego portfolio." });
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

  const addFoodOrder = (orderData: NewFoodOrderData) => {
    if (!user) return;

    let deadlineDate: Date | undefined;
    if (orderData.deadline) {
        deadlineDate = new Date();
        const [hours, minutes] = orderData.deadline.split(':').map(Number);
        deadlineDate.setHours(hours, minutes, 0, 0);
    }

    const baseEvent = {
        id: `evt-${Date.now()}`,
        creatorId: user.id,
        companyName: orderData.companyName,
        isOpen: true,
        deadline: deadlineDate?.toISOString(),
        description: orderData.description,
    };

    let newEvent: FoodOrder;
    if (orderData.type === 'voting') {
        const currentOrders = foodOrders.map(o => o.type === 'voting' && o.isOpen ? {...o, isOpen: false} : o);
        newEvent = {
            ...baseEvent,
            type: 'voting',
            votingOptions: orderData.votingOptions.map((opt, index) => ({
                id: `opt-${Date.now()}-${index}`,
                name: opt.name,
                link: opt.link,
                votes: [],
                addedById: user.id,
            })),
            orders: [] // Ensure orders is not undefined for type consistency
        };
         setFoodOrders([newEvent, ...currentOrders]);
    } else { // 'order'
        const { link, creatorPhoneNumber } = orderData;
        newEvent = {
            ...baseEvent,
            type: 'order',
            link,
            creatorPhoneNumber,
            orders: [],
        };
        const detailsToStore: StoredOrderDetails = { link, creatorPhoneNumber };
        try {
            localStorage.setItem('lastOrderDetails', JSON.stringify(detailsToStore));
            setStoredOrderDetails(detailsToStore);
        } catch (error) {
            console.error("Failed to write to localStorage", error);
        }
        setFoodOrders([newEvent, ...foodOrders]);
    }

    toast({ title: "Wydarzenie utworzone!", description: `Wydarzenie "${orderData.companyName}" jest już aktywne.` });
  };
  
  const editFoodOrder = (orderId: string, editedData: Omit<FoodOrder, 'id' | 'creatorId' | 'orders' | 'isOpen' | 'type' | 'votingOptions'> & { type: 'order' }) => {
    if (!user) return;
    const deadlineDate = editedData.deadline ? new Date() : undefined;
    if (deadlineDate && editedData.deadline) {
        const [hours, minutes] = editedData.deadline.split(':').map(Number);
        deadlineDate.setHours(hours, minutes, 0, 0);
    }


    setFoodOrders(prevOrders => prevOrders.map(order => {
        if (order.id === orderId) {
            if (user.id !== order.creatorId && user.role !== 'admin') {
                toast({ variant: 'destructive', title: 'Brak uprawnień', description: 'Tylko twórca lub administrator może edytować wydarzenie.' });
                return order;
            }
            return {
                ...order,
                companyName: editedData.companyName,
                description: editedData.description,
                link: editedData.link,
                creatorPhoneNumber: editedData.creatorPhoneNumber,
                deadline: deadlineDate?.toISOString(),
            };
        }
        return order;
    }));

    toast({ title: "Zapisano zmiany", description: `Wydarzenie "${editedData.companyName}" zostało zaktualizowane.` });
  };

  const removeFoodOrder = (orderId: string) => {
    if (!user) return;
    if (user.role !== 'admin' && user.id !== foodOrders.find(o => o.id === orderId)?.creatorId) {
      toast({ variant: 'destructive', title: 'Brak uprawnień', description: 'Tylko administrator lub twórca może usunąć wydarzenie.' });
      return;
    }
    setFoodOrders(prev => prev.filter(order => order.id !== orderId));
    toast({ title: "Wydarzenie usunięte", description: "Całe wydarzenie jedzeniowe zostało usunięte." });
  };

  const addOrderItem = (orderId: string, itemData: OrderItemData, guestName?: string) => {
    if (!user && !guestName) return;

    const newItem: OrderItem = {
        ...itemData,
        id: `item-${Date.now()}`,
        userId: guestName ? null : user!.id,
        guestName: guestName,
        isPaid: false,
    };

    setFoodOrders(prev => prev.map(order => {
        if (order.id === orderId && order.type === 'order') {
            return { ...order, orders: [...(order.orders || []), newItem] };
        }
        return order;
    }));

    const toastMessage = guestName
      ? `Zamówienie dla gościa "${guestName}" zostało złożone.`
      : `Twoje zamówienie na "${itemData.name}" zostało złożone.`;
    toast({ title: "Dodano zamówienie", description: toastMessage });
  };

  const removeOrderItem = (orderId: string, itemId: string) => {
    setFoodOrders(prev => prev.map(order => {
        if (order.id === orderId && order.type === 'order') {
            const itemToRemove = order.orders?.find(item => item.id === itemId);
            if (!itemToRemove) return order;
            if (user?.role !== 'admin' && user?.id !== order.creatorId && user?.id !== itemToRemove.userId) {
                toast({ variant: 'destructive', title: "Brak uprawnień" });
                return order;
            }
            return { ...order, orders: order.orders?.filter(item => item.id !== itemId) };
        }
        return order;
    }));
    toast({ title: "Usunięto pozycję zamówienia" });
  };
  
  const togglePaidStatus = (orderId: string, itemId: string | 'all') => {
      setFoodOrders(prev => prev.map(order => {
          if (order.id === orderId && order.type === 'order') {
              if (user?.id !== order.creatorId && user?.role !== 'admin') {
                  return order;
              }
              if (!order.orders || order.orders.length === 0) {
                  return order;
              }
              const newOrders = order.orders.map(item => {
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
    setFoodOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          if (user?.id !== order.creatorId && user?.role !== 'admin') {
            toast({ variant: 'destructive', title: 'Brak uprawnień', description: 'Tylko twórca lub administrator może zmienić status wydarzenia.' });
            return order;
          }
          const newState = !order.isOpen;
          // When resuming a voting event, close any other active voting events
          if (newState && order.type === 'voting') {
              return prev.map(o => {
                  if(o.id === orderId) return { ...o, isOpen: true };
                  if(o.type === 'voting' && o.isOpen) return { ...o, isOpen: false };
                  return o;
              }).find(o => o.id === orderId)!;
          }
          return { ...order, isOpen: newState };
        }
        return order;
      })
    );
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
                // Allow voting for multiple options
                return opt;
            });
            return { ...event, votingOptions: newOptions };
        }
        return event;
      }));
  }

  const addVotingOption = (eventId: string, optionData: { name: string, link?: string }) => {
    if (!user) return;
    
    const newOption: VotingOption = {
        id: `opt-${Date.now()}`,
        name: optionData.name,
        link: optionData.link,
        votes: [], // User who adds doesn't vote automatically
        addedById: user.id,
    };

    setFoodOrders(prev => prev.map(event => {
        if (event.id === eventId && event.type === 'voting' && event.isOpen) {
            const options = event.votingOptions ? [...event.votingOptions, newOption] : [newOption];
            return { ...event, votingOptions: options };
        }
        return event;
    }));
    toast({ title: "Dodano nową opcję", description: `Twoja propozycja "${optionData.name}" została dodana do głosowania.` });
  };

  const createOrderFromVote = (eventId: string, optionId: string) => {
    if (!user) return;
    const votingEvent = foodOrders.find(e => e.id === eventId && e.type === 'voting');
    if (!votingEvent || !votingEvent.votingOptions) return;

    const winningOption = votingEvent.votingOptions.find(o => o.id === optionId);
    if (!winningOption) return;

    const newOrder: FoodOrder = {
        id: `evt-${Date.now()}`,
        creatorId: user.id,
        companyName: winningOption.name,
        link: winningOption.link,
        isOpen: true,
        type: 'order',
        orders: [],
        creatorPhoneNumber: storedOrderDetails?.creatorPhoneNumber,
    };

    setFoodOrders(prev => [newOrder, ...prev]);
    toast({ title: "Utworzono zamówienie!", description: `Można teraz składać zamówienia z "${winningOption.name}".` });
  };


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
        editFoodOrder,
        removeFoodOrder,
        addOrderItem,
        removeOrderItem,
        togglePaidStatus,
        toggleOrderState,
        toggleVote,
        addVotingOption,
        createOrderFromVote,
        storedOrderDetails,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

    