import { Router } from "express";
import { requireEmail, requireName, requirePassword } from "../validators/auth";
import { signup, login } from "../controllers/auth";

const router = Router();

router.put("/signup", [requireEmail, requireName, requirePassword], signup);

router.post("/login", login);

export default router;
