import { Router } from "express";
import UserController from "../controller/UserController";

const router = Router();
const userController = new UserController();

router.get("/users/find", userController.find);
router.post("/users/add", userController.add);

export default router;
