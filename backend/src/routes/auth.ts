import { Router } from "express";
import { login, signup } from "../controllers/auth";
import { requireEmail, requireName, requirePassword } from "../validators/auth";

const router = Router();

router.put("/signup", [requireEmail, requireName, requirePassword], signup);

router.post("/login", login);

export default router;
