import express from "express"
import { loginUser, registerUser } from "../controllers/auth-controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = express.Router();

router.get("/health", (req, res) => {
    res.status(200).json({
        message : "Auth service running"
    });
});

// การเขียน Route แบบเรียก function จาก Controller > service
router.post("/register", registerUser) 

router.post("/login", loginUser);

router.get("/profile", authMiddleware);

export default router