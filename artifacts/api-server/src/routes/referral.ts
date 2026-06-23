import { Router } from "express";
import { db, referralsTable, claimsTable } from "@workspace/db";
import { eq, count, sum } from "drizzle-orm";
import { GetReferralStatsParams, ValidateReferralCodeParams } from "@workspace/api-zod";

const router = Router();

const REFERRAL_BONUS = 50;

function walletToCode(wallet: string): string {
  return wallet.toLowerCase().replace("0x", "ref-");
}

function codeToWallet(code: string): string {
  return "0x" + code.replace("ref-", "");
}

function isValidCode(code: string): boolean {
  return /^ref-[0-9a-f]{40}$/.test(code);
}

router.get("/referral/validate/:referralCode", async (req, res) => {
  const parsed = ValidateReferralCodeParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid referral code" });
    return;
  }

  const { referralCode } = parsed.data;

  if (!isValidCode(referralCode)) {
    res.json({ valid: false, referralCode, referrerWallet: null });
    return;
  }

  const referrerWallet = codeToWallet(referralCode);

  const [claim] = await db
    .select()
    .from(claimsTable)
    .where(eq(claimsTable.walletAddress, referrerWallet))
    .limit(1);

  const valid = !!claim;

  res.json({ valid, referralCode, referrerWallet: valid ? referrerWallet : null });
});

router.get("/referral/:walletAddress", async (req, res) => {
  const parsed = GetReferralStatsParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid wallet address" });
    return;
  }

  const { walletAddress } = parsed.data;
  const wallet = walletAddress.toLowerCase();

  const referralCode = walletToCode(wallet);

  const origin = req.headers.origin || req.headers.host || "https://celo-mini-app-sqweezza15.replit.app";
  const baseUrl = origin.startsWith("http") ? origin : `https://${origin}`;
  const referralLink = `${baseUrl}/?ref=${referralCode}`;

  const myReferrals = await db
    .select()
    .from(referralsTable)
    .where(eq(referralsTable.referrerWallet, wallet));

  const totalBonus = myReferrals.reduce((acc, r) => acc + r.bonusEarned, 0);

  res.json({
    walletAddress: wallet,
    referralCode,
    referralLink,
    totalReferrals: myReferrals.length,
    bonusEarned: totalBonus,
    referrals: myReferrals.map((r) => ({
      referredWallet: r.referredWallet,
      bonusEarned: r.bonusEarned,
      createdAt: r.createdAt.toISOString(),
    })),
  });
});

export { walletToCode, codeToWallet, isValidCode, REFERRAL_BONUS };
export default router;
