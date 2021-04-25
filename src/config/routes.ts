import { Router } from "express";
import UserController from "../controllers/UserController";
import CategoryController from "../controllers/CategoryController";

const router = Router();
const userController = new UserController();
const categoryController = new CategoryController();

router.get("/users/find", userController.find);
router.post("/users/add", userController.add);
router.get("/category/find", categoryController.find);
router.post("/category/add", categoryController.add);

export default router;
