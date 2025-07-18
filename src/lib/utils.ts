import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const MAX_SPOTS = 12;

export function getOccupancyDetails(booked: number) {
  const freeSpots = MAX_SPOTS - booked;

  if (booked <= 1) {
    return { color: "bg-blue-500", textColor: "text-blue-500", label: "Almost empty" };
  }
  if (booked <= 8) {
    return { color: "bg-green-500", textColor: "text-green-500", label: "Partially full" };
  }
  if (booked <= 9) {
    return { color: "bg-yellow-500", textColor: "text-yellow-500", label: "Filling up" };
  }
  if (booked < MAX_SPOTS) {
    return { color: "bg-red-500", textColor: "text-red-500", label: "Almost full" };
  }
  return { color: "bg-red-600", textColor: "text-red-600", label: "Full" };
}
