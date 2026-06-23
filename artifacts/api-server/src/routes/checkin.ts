import { Router } from "express";
import { db, checkInsTable, streaksTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { DailyCheckinBody, GetStreakStatusParams } from "@workspace/api-zod";

const router = Router();

const CYCLE_LENGTH = 30;
const MAX_CYCLE_MULTIPLIER = 3; // cap at cycle 3

const BASE_MILESTONES = [
  { day: 3,  bonus: 300,  label: "3-Day Spark" },
  { day: 7,  bonus: 700,  label: "1-Week Flame" },
  { day: 14, bonus: 1000, label: "2-Week Blaze" },
  { day: 21, bonus: 1500, label: "3-Week Inferno" },
  { day: 30, bonus: 2000, label: "30-Day Jackpot" },
];

function getCycleNumber(streak: number): number {
  if (streak <= 0) return 1;
  return Math.min(Math.floor((streak - 1) / CYCLE_LENGTH) + 1, MAX_CYCLE_MULTIPLIER);
}

function getCycleMultiplier(cycleNum: number): number {
  return Math.pow(1.2, cycleNum - 1);
}

function getMilestonesForCycle(cycleNum: number) {
  const mult = getCycleMultiplier(cycleNum);
  return BASE_MILESTONES.map((m) => ({
    ...m,
    bonus: Math.round(m.bonus * mult),
    label: m.label + (cycleNum > 1 ? ` (×${mult.toFixed(2)})` : ""),
  }));
}

function getDayInCycle(streak: number): number {
  if (streak <= 0) return 0;
  const pos = streak % CYCLE_LENGTH;
  return pos === 0 ? CYCLE_LENGTH : pos;
}

function getMilestoneBonus(streak: number): { bonus: number; label: string } | null {
  const cycleNum = getCycleNumber(streak);
  const dayInCycle = getDayInCycle(streak);
  const milestones = getMilestonesForCycle(cycleNum);
  return milestones.find((m) => m.day === dayInCycle) ?? null;
}

function getDaysToNextMilestone(streak: number): number {
  const dayInCycle = getDayInCycle(streak);
  for (const m of BASE_MILESTONES) {
    if (m.day > dayInCycle) return m.day - dayInCycle;
  }
  return CYCLE_LENGTH - dayInCycle;
}

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

router.post("/checkin", async (req, res) => {
  const parsed = DailyCheckinBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { walletAddress } = parsed.data;
  const wallet = walletAddress.toLowerCase();

  const [existing] = await db
    .select()
    .from(streaksTable)
    .where(eq(streaksTable.walletAddress, wallet))
    .limit(1);

  if (existing?.lastCheckinAt && isToday(existing.lastCheckinAt)) {
    res.status(400).json({ error: "Already checked in today. Come back tomorrow!" });
    return;
  }

  const prevStreak = existing?.currentStreak ?? 0;
  const prevLongest = existing?.longestStreak ?? 0;
  const prevTotal = existing?.totalCheckins ?? 0;
  const prevBonus = existing?.totalBonusEarned ?? 0;

  const streakBroken = existing?.lastCheckinAt ? !isYesterday(existing.lastCheckinAt) : false;
  const newStreak = streakBroken ? 1 : prevStreak + 1;
  const newLongest = Math.max(prevLongest, newStreak);

  const milestone = getMilestoneBonus(newStreak);
  const bonusEarned = 10 + (milestone?.bonus ?? 0);
  const nextMilestone = getDaysToNextMilestone(newStreak);
  const cycleNum = getCycleNumber(newStreak);

  await db.insert(checkInsTable).values({ walletAddress: wallet });

  if (existing) {
    await db
      .update(streaksTable)
      .set({
        currentStreak: newStreak,
        longestStreak: newLongest,
        totalCheckins: prevTotal + 1,
        totalBonusEarned: prevBonus + bonusEarned,
        lastCheckinAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(streaksTable.walletAddress, wallet));
  } else {
    await db.insert(streaksTable).values({
      walletAddress: wallet,
      currentStreak: newStreak,
      longestStreak: newLongest,
      totalCheckins: 1,
      totalBonusEarned: bonusEarned,
      lastCheckinAt: new Date(),
    });
  }

  const message = milestone
    ? `Milestone unlocked: ${milestone.label}! +${bonusEarned} G$ earned!`
    : `Day ${getDayInCycle(newStreak)} of Cycle ${cycleNum}! +${bonusEarned} G$ earned.`;

  res.json({
    success: true,
    currentStreak: newStreak,
    bonusEarned,
    milestoneReached: !!milestone,
    milestoneName: milestone?.label ?? null,
    nextMilestone,
    message,
    totalBonusEarned: prevBonus + bonusEarned,
  });
});

router.get("/checkin/streak/:walletAddress", async (req, res) => {
  const parsed = GetStreakStatusParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid wallet address" });
    return;
  }

  const { walletAddress } = parsed.data;
  const wallet = walletAddress.toLowerCase();

  const [streak] = await db
    .select()
    .from(streaksTable)
    .where(eq(streaksTable.walletAddress, wallet))
    .limit(1);

  const currentStreak = streak?.currentStreak ?? 0;
  const canCheckinToday = !streak?.lastCheckinAt || !isToday(streak.lastCheckinAt);
  const cycleNum = getCycleNumber(currentStreak);
  const dayInCycle = getDayInCycle(currentStreak);
  const cycleMillstones = getMilestonesForCycle(cycleNum);

  const milestones = cycleMillstones.map((m) => ({
    day: m.day,
    bonus: m.bonus,
    label: m.label,
    reached: dayInCycle >= m.day,
  }));

  res.json({
    walletAddress: wallet,
    currentStreak,
    longestStreak: streak?.longestStreak ?? 0,
    totalCheckins: streak?.totalCheckins ?? 0,
    totalBonusEarned: streak?.totalBonusEarned ?? 0,
    canCheckinToday,
    lastCheckinAt: streak?.lastCheckinAt?.toISOString() ?? null,
    nextMilestone: getDaysToNextMilestone(currentStreak),
    currentCycleDay: dayInCycle,
    milestones,
  });
});

export default router;
