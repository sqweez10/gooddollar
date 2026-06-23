import { useGetLeaderboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Flame, Medal } from "lucide-react";

export function Leaderboard() {
  const { data: entries, isLoading } = useGetLeaderboard();

  const rankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-4 h-4 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-slate-400" />;
    if (rank === 3) return <Medal className="w-4 h-4 text-amber-600" />;
    return <span className="text-xs font-bold text-muted-foreground w-4 text-center">#{rank}</span>;
  };

  const formatAddress = (addr: string) =>
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5 text-yellow-500" /> Streak Leaderboard
        </CardTitle>
        <CardDescription>Top wallets ranked by current streak</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : !entries || entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
            <Trophy className="w-8 h-8 opacity-20" />
            <p className="text-sm">No streaks yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.walletAddress}
                className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                  entry.rank <= 3
                    ? "bg-yellow-50/50 dark:bg-yellow-950/10 border border-yellow-100 dark:border-yellow-900/20"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="w-6 flex items-center justify-center shrink-0">
                  {rankIcon(entry.rank)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm font-medium truncate">
                    {formatAddress(entry.walletAddress)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {entry.totalCheckins} check-ins · {entry.totalBonusEarned} G$ earned
                  </div>
                </div>
                <div className="flex items-center gap-1 text-orange-500 font-bold text-sm shrink-0">
                  <Flame className="w-3.5 h-3.5" />
                  {entry.currentStreak}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
