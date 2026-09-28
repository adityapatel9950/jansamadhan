import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { authenticateJwt } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.get("/me", authenticateJwt, (req, res) =>
  authController.getMe(req, res),
);
router.get("/demo-accounts", (req, res) =>
  authController.getDemoAccounts(req, res),
);

export default router;
