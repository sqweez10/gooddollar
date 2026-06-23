interface ShareImageCardProps {
  streak: number;
  bonusEarned: number;
  milestoneReached: boolean;
  milestoneLabel?: string;
  cycleNum: number;
  totalBonusEarned: number;
  walletAddress: string;
}

export function ShareImageCard({
  streak,
  bonusEarned,
  milestoneReached,
  milestoneLabel,
  cycleNum,
  totalBonusEarned,
  walletAddress,
}: ShareImageCardProps) {
  const shortWallet = `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`;

  return (
    <div
      style={{
        width: 1200,
        height: 630,
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a1035 40%, #0d1f3c 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
        padding: "60px",
        boxSizing: "border-box",
      }}
    >
      {/* Background glow blobs */}
      <div style={{
        position: "absolute", top: -120, right: -120,
        width: 500, height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
      }} />
      <div style={{
        position: "absolute", bottom: -100, left: -100,
        width: 400, height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(251,146,60,0.2) 0%, transparent 70%)",
      }} />
      {/* Subtle grid pattern */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* Top branding row */}
      <div style={{
        position: "absolute", top: 40, left: 60, right: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: "bold", color: "white",
          }}>
            G$
          </div>
          <span style={{ color: "white", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" }}>
            GoodDollar Faucet
          </span>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 20, padding: "6px 14px",
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Celo Network</span>
        </div>
      </div>

      {/* Center content */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 24, position: "relative", zIndex: 1,
      }}>
        {/* Milestone badge or streak flame */}
        {milestoneReached ? (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
          }}>
            <div style={{ fontSize: 64 }}>🏆</div>
            <div style={{
              background: "linear-gradient(135deg, #f59e0b, #ef4444)",
              borderRadius: 16, padding: "10px 28px",
              color: "white", fontSize: 20, fontWeight: 700,
              letterSpacing: "0.5px",
            }}>
              MILESTONE UNLOCKED
            </div>
            <div style={{ color: "#fbbf24", fontSize: 28, fontWeight: 800 }}>
              {milestoneLabel}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 72 }}>🔥</span>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, fontWeight: 500 }}>
                Current Streak
              </span>
              <span style={{
                color: "white", fontSize: 80, fontWeight: 900,
                lineHeight: 1, letterSpacing: "-4px",
              }}>
                {streak}
              </span>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 22, fontWeight: 500 }}>
                day{streak !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}

        {/* Bonus earned today */}
        <div style={{
          display: "flex", alignItems: "center", gap: 40,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20, padding: "20px 48px",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 4 }}>
              Earned Today
            </div>
            <div style={{ color: "#34d399", fontSize: 36, fontWeight: 800 }}>
              +{bonusEarned.toLocaleString()} G$
            </div>
          </div>
          <div style={{ width: 1, height: 48, background: "rgba(255,255,255,0.15)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 4 }}>
              Total Earned
            </div>
            <div style={{ color: "#a78bfa", fontSize: 36, fontWeight: 800 }}>
              {totalBonusEarned.toLocaleString()} G$
            </div>
          </div>
          {cycleNum > 1 && (
            <>
              <div style={{ width: 1, height: 48, background: "rgba(255,255,255,0.15)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 4 }}>
                  Cycle
                </div>
                <div style={{ color: "#f472b6", fontSize: 36, fontWeight: 800 }}>
                  ×{Math.pow(1.2, cycleNum - 1).toFixed(2)}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div style={{
        position: "absolute", bottom: 40, left: 60, right: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, fontFamily: "monospace" }}>
          {shortWallet}
        </span>
        <span style={{
          color: "rgba(255,255,255,0.5)", fontSize: 15, fontWeight: 500,
        }}>
          gooddollar.org · Claim your free G$ on Celo
        </span>
      </div>
    </div>
  );
}
