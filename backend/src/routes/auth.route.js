import express from "express";
import { login, logout, signup, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
// Hacemos uso de un middleware en el que primero autenticamos si la sesion esta activa, para luego modificar
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth); // Esto con el fin de que si reiniciamos, el usuario se mantenga en sesion
export default router;