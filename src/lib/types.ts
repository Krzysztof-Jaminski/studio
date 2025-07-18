export type User = {
  id: string;
  name: string;
  email: string;
};

export type Day = {
  date: Date;
  isToday: boolean;
  isPast: boolean;
};

export type Reservation = {
  date: string; // YYYY-MM-DD
  users: string[]; // array of user IDs
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
