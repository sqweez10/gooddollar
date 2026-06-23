import { useState } from "react";
import {
  useGetReferralStats,
  getGetReferralStatsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Copy, CheckCheck, Lock, ExternalLink, Gift } from "lucide-react";

interface ReferralPanelProps {
  walletAddress: string | null;
}

export function ReferralPanel({ walletAddress }: ReferralPanelProps) {
  const [copied, setCopied] = useState(false);

  const { data: stats, isLoading } = useGetReferralStats(walletAddress ?? "", {
    query: {
      enabled: !!walletAddress,
      queryKey: getGetReferralStatsQueryKey(walletAddress ?? ""),
    },
  });

  const copyLink = () => {
    if (!stats?.referralLink) return;
    navigator.clipboard.writeText(stats.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnX = () => {
    if (!stats) return;
    const text = `Join me on G$ Faucet — claim free GoodDollar tokens on @Celo, verified humans only!\n\nUse my invite link to get started:`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(stats.referralLink)}`,
      "_blank"
    );
  };

  const shareOnFarcaster = () => {
    if (!stats) return;
    const text = `Join me on G$ Faucet — claim free GoodDollar tokens on Celo, verified humans only!\n\nUse my invite link: ${stats.referralLink}`;
    window.open(
      `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const formatAddress = (addr: string) =>
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  if (!walletAddress) {
    return (
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5 text-blue-500" /> Invite Friends
          </CardTitle>
          <CardDescription>Connect wallet to get your referral link</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-16 text-muted-foreground text-sm">
            <Lock className="w-4 h-4 mr-2" /> Wallet required
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="w-5 h-5 text-blue-500" /> Invite Friends
        </CardTitle>
        <CardDescription>
          Earn +50 G$ for every friend who claims through your link
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-lg p-3 text-center">
            {isLoading ? (
              <Skeleton className="h-7 w-10 mx-auto mb-1" />
            ) : (
              <div className="text-2xl font-bold text-blue-600">{stats?.totalReferrals ?? 0}</div>
            )}
            <div className="text-xs text-muted-foreground">Friends Invited</div>
          </div>
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 rounded-lg p-3 text-center">
            {isLoading ? (
              <Skeleton className="h-7 w-16 mx-auto mb-1" />
            ) : (
              <div className="text-2xl font-bold text-green-600">+{(stats?.bonusEarned ?? 0).toLocaleString()}</div>
            )}
            <div className="text-xs text-muted-foreground">G$ Bonus Earned</div>
          </div>
        </div>

        {/* Referral link box */}
        <div>
          <p className="text-xs text-muted-foreground mb-1.5 font-medium">Your invite link</p>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-3 py-2">
              <span className="text-xs font-mono text-muted-foreground flex-1 truncate">
                {stats?.referralLink}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 shrink-0"
                onClick={copyLink}
              >
                {copied ? (
                  <CheckCheck className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Share buttons */}
        <div className="flex gap-2">
          <button
            onClick={shareOnX}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-black text-white hover:bg-black/80 transition-colors disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X
          </button>
          <button
            onClick={shareOnFarcaster}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-colors disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.83 0C5.297 0 0 5.297 0 11.83v.34C0 18.703 5.297 24 11.83 24h.34C18.703 24 24 18.703 24 12.17v-.34C24 5.297 18.703 0 12.17 0h-.34zm4.17 6l-4 6-4-6H5l5 7.5V18h4v-4.5L19 6h-3z" />
            </svg>
            Share on Farcaster
          </button>
        </div>

        {/* Bonus info */}
        <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg border border-border/50">
          <Gift className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            When a friend claims G$ through your link, you both benefit — they get their tokens, and you earn <strong>+50 G$</strong> bonus automatically.
          </p>
        </div>

        {/* Recent referrals */}
        {stats && stats.referrals.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Recent invites</p>
            <div className="space-y-2">
              {stats.referrals.slice(0, 5).map((r, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="font-mono text-muted-foreground">{formatAddress(r.referredWallet)}</span>
                  <span className="text-green-600 font-semibold">+{r.bonusEarned} G$</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
