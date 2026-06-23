import { Router } from "express";
import { db, streaksTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

router.get("/leaderboard", async (req, res) => {
  const top = await db
    .select()
    .from(streaksTable)
    .orderBy(desc(streaksTable.currentStreak), desc(streaksTable.longestStreak))
    .limit(20);

  const entries = top.map((row, idx) => ({
    rank: idx + 1,
    walletAddress: row.walletAddress,
    currentStreak: row.currentStreak,
    longestStreak: row.longestStreak,
    totalCheckins: row.totalCheckins,
    totalBonusEarned: row.totalBonusEarned,
  }));

  res.json(entries);
});

export default router;
