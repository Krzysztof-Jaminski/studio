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
