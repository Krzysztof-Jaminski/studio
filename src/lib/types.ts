
export type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
};

export type Day = {
  date: Date;
  isToday: boolean;
  isPast: boolean;
};

export type Reservation = {
  date: string; // YYYY-MM-DD
  office: string[]; // array of user IDs
  online: string[]; // array of user IDs
};

export type WeeklyStatus = {
    week: number;
    content: string;
    status: 'draft' | 'published';
};

export type PortfolioItem = {
    id: string;
    type: 'status' | 'project';
    title: string;
    description: string;
    date: string; // ISO string
    isVisible: boolean;
    // Status-specific
    weekOf?: string; // ISO string for start of week
    // Project-specific
    link?: string;
    technologies?: string[];
};

export type OrderItem = {
    id: string;
    userId: string;
    name: string;
    details?: string;
    price: number;
    isPaid: boolean;
}

export type OrderItemData = Omit<OrderItem, 'id' | 'userId' | 'isPaid'>;

export type VotingOption = {
    id: string;
    name: string;
    link?: string;
    imageUrl?: string;
    votes: string[]; // array of user IDs
};

export type FoodOrder = {
    id: string;
    creatorId: string;
    companyName: string; // Also used for Voting Title
    isOpen: boolean;
    type: 'order' | 'voting';
    deadline?: string; // ISO string for the deadline
    // Order specific
    link?: string;
    creatorPhoneNumber?: string;
    imageUrl?: string;
    orders?: OrderItem[];
    // Voting specific
    votingOptions?: VotingOption[];
};
