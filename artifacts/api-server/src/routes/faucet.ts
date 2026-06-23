import { Router } from "express";
import { db, claimsTable, referralsTable } from "@workspace/db";
import { eq, count, gte, desc } from "drizzle-orm";
import {
  ClaimTokensBody,
  GetClaimStatusParams,
  CheckVerificationStatusParams,
} from "@workspace/api-zod";
import { isValidCode, codeToWallet, REFERRAL_BONUS } from "./referral";

const router = Router();

const G_DOLLAR_CLAIM_AMOUNT = "100";

function generateMockTxHash(): string {
  const chars = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

async function isGoodDollarVerified(walletAddress: string): Promise<boolean> {
  return true;
}

router.post("/faucet/claim", async (req, res) => {
  const parsed = ClaimTokensBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { walletAddress, verificationProof, referralCode } = parsed.data;

  const existing = await db
    .select()
    .from(claimsTable)
    .where(eq(claimsTable.walletAddress, walletAddress.toLowerCase()))
    .limit(1);

  if (existing.length > 0) {
    res.status(409).json({ error: "This wallet has already claimed G$ tokens" });
    return;
  }

  const isVerified = await isGoodDollarVerified(walletAddress);
  if (!isVerified) {
    res.status(400).json({ error: "Wallet is not verified by GoodDollar. Please complete face verification first." });
    return;
  }

  const txHash = generateMockTxHash();

  const [claim] = await db
    .insert(claimsTable)
    .values({
      walletAddress: walletAddress.toLowerCase(),
      amount: G_DOLLAR_CLAIM_AMOUNT,
      txHash,
      isVerified: true,
      verificationProof: verificationProof ?? null,
    })
    .returning();

  if (referralCode && isValidCode(referralCode)) {
    const referrerWallet = codeToWallet(referralCode);
    const referrerClaim = await db
      .select()
      .from(claimsTable)
      .where(eq(claimsTable.walletAddress, referrerWallet))
      .limit(1);

    if (referrerClaim.length > 0 && referrerWallet !== walletAddress.toLowerCase()) {
      await db.insert(referralsTable).values({
        referrerWallet,
        referredWallet: walletAddress.toLowerCase(),
        bonusEarned: REFERRAL_BONUS,
        claimed: true,
      }).onConflictDoNothing();
    }
  }

  res.json({
    success: true,
    txHash: claim.txHash,
    amount: claim.amount,
    walletAddress: claim.walletAddress,
    claimedAt: claim.claimedAt.toISOString(),
  });
});

router.get("/faucet/status/:walletAddress", async (req, res) => {
  const parsed = GetClaimStatusParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid wallet address" });
    return;
  }

  const { walletAddress } = parsed.data;

  const [claim] = await db
    .select()
    .from(claimsTable)
    .where(eq(claimsTable.walletAddress, walletAddress.toLowerCase()))
    .limit(1);

  const isVerified = await isGoodDollarVerified(walletAddress);

  res.json({
    walletAddress: walletAddress.toLowerCase(),
    hasClaimed: !!claim,
    isVerified,
    claimedAt: claim?.claimedAt?.toISOString() ?? null,
    txHash: claim?.txHash ?? null,
    amount: claim?.amount ?? null,
  });
});

router.get("/faucet/stats", async (req, res) => {
  const [totalResult] = await db
    .select({ count: count() })
    .from(claimsTable);

  const [uniqueResult] = await db
    .select({ count: count() })
    .from(claimsTable);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todayResult] = await db
    .select({ count: count() })
    .from(claimsTable)
    .where(gte(claimsTable.claimedAt, today));

  const allClaims = await db.select({ amount: claimsTable.amount }).from(claimsTable);
  const totalDistributed = allClaims.reduce((acc, c) => acc + parseFloat(c.amount), 0);

  res.json({
    totalClaims: totalResult.count,
    uniqueWallets: uniqueResult.count,
    totalDistributed: totalDistributed.toFixed(2),
    claimsToday: todayResult.count,
  });
});

router.get("/faucet/recent", async (req, res) => {
  const recent = await db
    .select()
    .from(claimsTable)
    .orderBy(desc(claimsTable.claimedAt))
    .limit(10);

  res.json(
    recent.map((c) => ({
      id: c.id,
      walletAddress: c.walletAddress,
      amount: c.amount,
      txHash: c.txHash,
      claimedAt: c.claimedAt.toISOString(),
    }))
  );
});

export default router;
