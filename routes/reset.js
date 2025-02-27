import experss from "express";
import { resetPassword } from "../controllers/resetPassword.js";
const router = experss();

router.post("/resetPassword/:token", resetPassword);

export default router;
