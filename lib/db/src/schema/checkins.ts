import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const checkInsTable = pgTable("check_ins", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  checkedInAt: timestamp("checked_in_at").notNull().defaultNow(),
});

export const streaksTable = pgTable("streaks", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  totalCheckins: integer("total_checkins").notNull().default(0),
  totalBonusEarned: integer("total_bonus_earned").notNull().default(0),
  lastCheckinAt: timestamp("last_checkin_at"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type CheckIn = typeof checkInsTable.$inferSelect;
export type Streak = typeof streaksTable.$inferSelect;
