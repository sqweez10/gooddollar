import { Router } from "express";
import sharp from "sharp";

const router = Router();

function buildOgSvg(params: {
  streak?: number;
  bonusEarned?: number;
  milestoneLabel?: string;
  walletAddress?: string;
}): string {
  const { streak, bonusEarned, milestoneLabel, walletAddress } = params;
  const shortWallet = walletAddress
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
    : null;

  const centerContent = milestoneLabel
    ? `
      <text x="600" y="245" text-anchor="middle" font-size="64" fill="none">🏆</text>
      <rect x="380" y="265" width="440" height="44" rx="12" fill="url(#mileBg)"/>
      <text x="600" y="295" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="18" font-weight="700" fill="white" letter-spacing="1">MILESTONE UNLOCKED</text>
      <text x="600" y="345" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="30" font-weight="800" fill="#fbbf24">${escapeXml(milestoneLabel)}</text>
    `
    : streak !== undefined
    ? `
      <text x="420" y="320" text-anchor="middle" font-size="80" fill="none">🔥</text>
      <text x="620" y="260" text-anchor="start" font-family="Inter,Arial,sans-serif" font-size="18" fill="rgba(255,255,255,0.5)">Current Streak</text>
      <text x="610" y="355" text-anchor="start" font-family="Inter,Arial,sans-serif" font-size="110" font-weight="900" fill="white" letter-spacing="-6">${streak}</text>
      <text x="620" y="385" text-anchor="start" font-family="Inter,Arial,sans-serif" font-size="22" fill="rgba(255,255,255,0.6)">day${streak !== 1 ? "s" : ""}</text>
    `
    : `
      <text x="600" y="260" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="52" font-weight="900" fill="white">Free G$ Tokens</text>
      <text x="600" y="310" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="24" fill="rgba(255,255,255,0.6)">For verified humans on Celo</text>
    `;

  const bonusRow =
    bonusEarned !== undefined
      ? `
      <rect x="200" y="410" width="800" height="80" rx="16" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      <text x="440" y="443" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="13" fill="rgba(255,255,255,0.5)">Earned Today</text>
      <text x="440" y="475" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="32" font-weight="800" fill="#34d399">+${bonusEarned.toLocaleString()} G$</text>
      <line x1="600" y1="425" x2="600" y2="477" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
      <text x="760" y="443" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="13" fill="rgba(255,255,255,0.5)">Claim yours free</text>
      <text x="760" y="475" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="22" font-weight="700" fill="#a78bfa">gooddollar.org</text>
    `
      : `
      <rect x="200" y="420" width="800" height="60" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      <text x="600" y="458" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="20" fill="rgba(255,255,255,0.7)">Claim 100 G$ · Daily check-in streaks · Built on Celo</text>
    `;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f0f1a"/>
      <stop offset="40%" stop-color="#1a1035"/>
      <stop offset="100%" stop-color="#0d1f3c"/>
    </linearGradient>
    <radialGradient id="glow1" cx="80%" cy="15%" r="45%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="10%" cy="90%" r="40%">
      <stop offset="0%" stop-color="#fb923c" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#fb923c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="mileBg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#ef4444"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <!-- Top bar -->
  <circle cx="56" cy="44" r="22" fill="url(#mileBg)"/>
  <text x="56" y="51" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="16" font-weight="900" fill="white">G$</text>
  <text x="90" y="52" text-anchor="start" font-family="Inter,Arial,sans-serif" font-size="22" font-weight="700" fill="white">GoodDollar Faucet</text>

  <rect x="1000" y="26" width="170" height="36" rx="18" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
  <circle cx="1018" cy="44" r="5" fill="#22c55e"/>
  <text x="1030" y="50" text-anchor="start" font-family="Inter,Arial,sans-serif" font-size="14" fill="rgba(255,255,255,0.7)">Celo Network</text>

  <!-- Center content -->
  ${centerContent}

  <!-- Bonus row -->
  ${bonusRow}

  <!-- Bottom bar -->
  ${shortWallet ? `<text x="60" y="598" text-anchor="start" font-family="monospace,Arial" font-size="14" fill="rgba(255,255,255,0.3)">${escapeXml(shortWallet)}</text>` : ""}
  <text x="1140" y="598" text-anchor="end" font-family="Inter,Arial,sans-serif" font-size="14" fill="rgba(255,255,255,0.4)">Claim free G$ · GoodBuilders on Celo</text>
</svg>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

router.get("/og-image.png", async (req, res) => {
  try {
    const svg = buildOgSvg({});
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(png);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate image" });
  }
});

router.get("/og-image/:walletAddress.png", async (req, res) => {
  const { walletAddress } = req.params;
  const streak = req.query["streak"] ? Number(req.query["streak"]) : undefined;
  const bonus = req.query["bonus"] ? Number(req.query["bonus"]) : undefined;
  const milestone = req.query["milestone"] ? String(req.query["milestone"]) : undefined;

  try {
    const svg = buildOgSvg({ streak, bonusEarned: bonus, milestoneLabel: milestone, walletAddress });
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=60");
    res.send(png);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate image" });
  }
});

export default router;
