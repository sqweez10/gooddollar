import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const referralsTable = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerWallet: text("referrer_wallet").notNull(),
  referredWallet: text("referred_wallet").notNull().unique(),
  bonusEarned: integer("bonus_earned").notNull().default(50),
  claimed: boolean("claimed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Referral = typeof referralsTable.$inferSelect;
