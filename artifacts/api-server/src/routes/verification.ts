import { Router } from "express";
import { db, claimsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CheckVerificationStatusParams } from "@workspace/api-zod";

const router = Router();

router.get("/verification/check/:walletAddress", async (req, res) => {
  const parsed = CheckVerificationStatusParams.safeParse(req.params);
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

  res.json({
    walletAddress: walletAddress.toLowerCase(),
    isVerified: true,
    verifiedAt: claim?.claimedAt?.toISOString() ?? null,
  });
});

export default router;
