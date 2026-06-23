import { Router, type IRouter } from "express";
import healthRouter from "./health";
import faucetRouter from "./faucet";
import verificationRouter from "./verification";
import checkinRouter from "./checkin";
import leaderboardRouter from "./leaderboard";
import referralRouter from "./referral";
import ogRouter from "./og";

const router: IRouter = Router();

router.use(healthRouter);
router.use(faucetRouter);
router.use(verificationRouter);
router.use(checkinRouter);
router.use(leaderboardRouter);
router.use(referralRouter);
router.use(ogRouter);

export default router;
