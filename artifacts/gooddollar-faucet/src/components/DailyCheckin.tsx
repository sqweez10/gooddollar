import { useState } from "react";
import {
  useDailyCheckin,
  useGetStreakStatus,
  getGetStreakStatusQueryKey,
  getGetLeaderboardQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Flame, CheckCircle2, Lock, Loader2, Trophy, Zap, Star, Share2 } from "lucide-react";
import { ShareModal } from "./ShareModal";

const CYCLE_LENGTH = 30;
const BASE_MILESTONES = [
  { day: 3,  baseBonus: 300,  label: "3-Day Spark" },
  { day: 7,  baseBonus: 700,  label: "1-Week Flame" },
  { day: 14, baseBonus: 1000, label: "2-Week Blaze" },
  { day: 21, baseBonus: 1500, label: "3-Week Inferno" },
  { day: 30, baseBonus: 2000, label: "30-Day Jackpot" },
];

function getCycleNum(streak: number) {
  if (streak <= 0) return 1;
  return Math.min(Math.floor((streak - 1) / CYCLE_LENGTH) + 1, 3);
}

function getMultiplier(cycleNum: number) {
  return Math.pow(1.2, cycleNum - 1);
}

function getDayInCycle(streak: number) {
  if (streak <= 0) return 0;
  const pos = streak % CYCLE_LENGTH;
  return pos === 0 ? CYCLE_LENGTH : pos;
}

interface DailyCheckinProps {
  walletAddress: string | null;
}

export function DailyCheckin({ walletAddress }: DailyCheckinProps) {
  const queryClient = useQueryClient();
  const [lastResult, setLastResult] = useState<{
    message: string;
    milestoneReached: boolean;
    milestoneLabel?: string;
    bonusEarned: number;
    streak: number;
  } | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const { data: streak, isLoading } = useGetStreakStatus(walletAddress ?? "", {
    query: {
      enabled: !!walletAddress,
      queryKey: getGetStreakStatusQueryKey(walletAddress ?? ""),
      refetchInterval: 30000,
    },
  });

  const checkin = useDailyCheckin();

  const handleCheckin = () => {
    if (!walletAddress) return;
    checkin.mutate(
      { data: { walletAddress } },
      {
        onSuccess: (result) => {
          const cycleN = getCycleNum(result.currentStreak);
          const mult = getMultiplier(cycleN);
          const hitMilestone = BASE_MILESTONES.find(
            (m) => getDayInCycle(result.currentStreak) === m.day
          );
          setLastResult({
            message: result.message,
            milestoneReached: result.milestoneReached,
            milestoneLabel: hitMilestone
              ? `${hitMilestone.label} (+${Math.round(hitMilestone.baseBonus * mult).toLocaleString()} G$)`
              : undefined,
            bonusEarned: result.bonusEarned,
            streak: result.currentStreak,
          });
          queryClient.invalidateQueries({ queryKey: getGetStreakStatusQueryKey(walletAddress) });
          queryClient.invalidateQueries({ queryKey: getGetLeaderboardQueryKey() });
        },
      }
    );
  };

  if (!walletAddress) {
    return (
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Flame className="w-5 h-5 text-orange-500" /> Daily Check-in
          </CardTitle>
          <CardDescription>Connect your wallet to start your streak</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">
            <Lock className="w-4 h-4 mr-2" /> Wallet required
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentStreak = streak?.currentStreak ?? 0;
  const dayInCycle = streak?.currentCycleDay ?? 0;
  const cycleNum = getCycleNum(currentStreak);
  const multiplier = getMultiplier(cycleNum);
  const progressPct = (dayInCycle / CYCLE_LENGTH) * 100;
  const canCheckin = streak?.canCheckinToday ?? true;
  const nextMilestone = streak?.nextMilestone ?? 3;

  const milestonesWithBonus = BASE_MILESTONES.map((m) => ({
    ...m,
    bonus: Math.round(m.baseBonus * multiplier),
    reached: dayInCycle >= m.day,
  }));

  const shareText = lastResult
    ? lastResult.milestoneReached
      ? `🏆 Milestone reached! ${lastResult.message}\n\nBuilding my streak on @GoodDollar Faucet on @Celo 🔥 Claim free G$ tokens for real humans!`
      : `🔥 Day ${lastResult.streak} check-in streak on @GoodDollar Faucet! Earned +${lastResult.bonusEarned} G$ today on @Celo.\n\nJoin me — claim free G$ tokens for verified humans:`
    : "";

  return (
    <>
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Flame className="w-5 h-5 text-orange-500" /> Daily Check-in
            </CardTitle>
            <div className="flex items-center gap-2">
              {cycleNum > 1 && (
                <span className="flex items-center gap-1 bg-purple-500/10 text-purple-600 px-2.5 py-1 rounded-full text-xs font-bold">
                  <Star className="w-3 h-3" /> Cycle {cycleNum} (×{multiplier.toFixed(2)})
                </span>
              )}
              <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-600 px-3 py-1 rounded-full text-sm font-bold">
                <Flame className="w-3.5 h-3.5" />
                {isLoading ? "—" : `${currentStreak} day${currentStreak !== 1 ? "s" : ""}`}
              </div>
            </div>
          </div>
          <CardDescription>
            Check in daily · Day {dayInCycle}/{CYCLE_LENGTH} of Cycle {cycleNum}
            {cycleNum < 3 && " · Bonuses scale ×1.2 next cycle"}
            {cycleNum >= 3 && " · Max cycle bonus active!"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Cycle {cycleNum} progress</span>
              <span>{nextMilestone} day{nextMilestone !== 1 ? "s" : ""} to next milestone</span>
            </div>
            <Progress value={progressPct} className="h-2.5" />
          </div>

          {/* Milestone track */}
          <div className="grid grid-cols-5 gap-1">
            {milestonesWithBonus.map((m) => (
              <div key={m.day} className="flex flex-col items-center gap-1.5 text-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  m.reached
                    ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200 dark:shadow-orange-900/30"
                    : dayInCycle > 0 && m.day === milestonesWithBonus.find(x => !x.reached)?.day
                    ? "border-orange-300 text-orange-400 bg-orange-50 dark:bg-orange-950/20"
                    : "border-border text-muted-foreground bg-muted/30"
                }`}>
                  {m.reached ? <CheckCircle2 className="w-4 h-4" /> : `D${m.day}`}
                </div>
                <div className={`text-[10px] font-semibold leading-tight ${m.reached ? "text-orange-600" : "text-muted-foreground"}`}>
                  +{m.bonus >= 1000 ? `${(m.bonus / 1000).toFixed(1)}k` : m.bonus}
                  <br />G$
                </div>
              </div>
            ))}
          </div>

          {/* Milestone labels */}
          <div className="grid grid-cols-5 gap-1 text-center">
            {milestonesWithBonus.map((m) => (
              <div key={m.day} className={`text-[9px] leading-tight truncate ${m.reached ? "text-orange-500 font-medium" : "text-muted-foreground"}`}>
                {m.label.split(" (")[0]}
              </div>
            ))}
          </div>

          {/* Result message + share button */}
          {lastResult && (
            <div className={`p-3 rounded-lg text-sm font-medium space-y-3 ${
              lastResult.milestoneReached
                ? "bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-400"
                : "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-400"
            }`}>
              <div>
                {lastResult.milestoneReached && <Trophy className="w-4 h-4 inline mr-1.5 mb-0.5" />}
                {lastResult.message}
              </div>
              <button
                onClick={() => setShareOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md"
              >
                <Share2 className="w-4 h-4" />
                Share with Image 📸
              </button>
            </div>
          )}

          {checkin.error && (
            <div className="p-3 rounded-lg text-sm bg-destructive/10 text-destructive border border-destructive/20">
              {(checkin.error as any)?.response?.data?.error ?? checkin.error.message}
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-lg font-bold">{streak?.longestStreak ?? 0}</div>
              <div className="text-[10px] text-muted-foreground">Best Streak</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-lg font-bold">{streak?.totalCheckins ?? 0}</div>
              <div className="text-[10px] text-muted-foreground">Total Check-ins</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-lg font-bold text-primary">{(streak?.totalBonusEarned ?? 0).toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground">G$ Earned</div>
            </div>
          </div>

          {/* Check-in button */}
          <Button
            className="w-full"
            size="lg"
            onClick={handleCheckin}
            disabled={!canCheckin || checkin.isPending || isLoading}
            variant={canCheckin ? "default" : "outline"}
          >
            {checkin.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Checking in...</>
            ) : canCheckin ? (
              <><Zap className="w-4 h-4 mr-2" /> Check In Today (+10 G$)</>
            ) : (
              <><CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> Checked in today</>
            )}
          </Button>

          {!canCheckin && (
            <p className="text-center text-xs text-muted-foreground">
              Come back tomorrow to continue your streak
            </p>
          )}

          {/* Cycle info box */}
          {cycleNum < 3 && (
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 text-xs text-purple-700 dark:text-purple-400">
              <Star className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" />
              Complete 30 days to enter <strong>Cycle {cycleNum + 1}</strong> — all bonuses become ×{Math.pow(1.2, cycleNum).toFixed(2)}!
            </div>
          )}
          {cycleNum >= 3 && (
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/30 text-xs text-yellow-700 dark:text-yellow-400">
              <Trophy className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" />
              You've reached <strong>Max Cycle 3</strong> — enjoy permanent ×{multiplier.toFixed(2)} bonuses forever!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Share Image Modal */}
      {lastResult && walletAddress && (
        <ShareModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          streak={lastResult.streak}
          bonusEarned={lastResult.bonusEarned}
          milestoneReached={lastResult.milestoneReached}
          milestoneLabel={lastResult.milestoneLabel}
          cycleNum={cycleNum}
          totalBonusEarned={streak?.totalBonusEarned ?? lastResult.bonusEarned}
          walletAddress={walletAddress}
          shareText={shareText}
        />
      )}
    </>
  );
}
