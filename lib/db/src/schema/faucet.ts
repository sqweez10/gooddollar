import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const claimsTable = pgTable("claims", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  amount: text("amount").notNull().default("100"),
  txHash: text("tx_hash").notNull(),
  isVerified: boolean("is_verified").notNull().default(true),
  verificationProof: text("verification_proof"),
  claimedAt: timestamp("claimed_at").notNull().defaultNow(),
});

export const insertClaimSchema = createInsertSchema(claimsTable).omit({ id: true, claimedAt: true });
export type InsertClaim = z.infer<typeof insertClaimSchema>;
export type Claim = typeof claimsTable.$inferSelect;
