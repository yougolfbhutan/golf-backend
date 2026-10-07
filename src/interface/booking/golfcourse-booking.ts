import type { PlayerType, SkillLevel } from "../../../generated/prisma";

export interface BookingInput {
  // customerId: number;
  golfCourseId: number;
  carrySetId: number;
  date: Date; // or Date type
  startTime?: string;
  endTime?: string;
}
interface AccessoryInput {
  itemId: number;
  quantity: number;
}

// type RoundType = 'standard' | 'premium';


export interface CreateBookingInput {
  golfCourseId: any;
  playerType: PlayerType;
  // courseId: "rtgc" | "drakpoi";
  skillLevel: string; // "newbie" | "established"
  teeOffDate: string; // "2026-10-20"
  teeTime: string; // "07:15"
  numberOfPlayers: number;
  partyName: string;
  partyEmail: string;
  partyPhone: string;
  nationality: string;
  specialRequest?: string;
  coaching: boolean;
  companion: boolean;
  golfSets?: { golfSetId: number; quantity: number }[];
  items?: { itemVariantId: number; quantity: number }[];
}
export interface CancelBookingInputAttributes {
  partyEmail: string;
  partyName: string;
  partyPhone: string;
}
