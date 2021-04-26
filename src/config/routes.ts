import { Router } from 'express';
import UserController from '../controllers/UserController';
import CategoryController from '../controllers/CategoryController';

const router = Router();
const userController = new UserController();
const categoryController = new CategoryController();

router.get("/users/find", userController.find);
router.post("/users/add", userController.add);
router.post("/users/delete", userController.deleteUser);
router.post("/users/deposit", userController.deposit);
router.post("/users/saque", userController.saque);
router.post("/users/transfer", userController.transfer);
router.get("/category/find", categoryController.find);
router.post("/category/add", categoryController.add);
router.post("/users/rendimento", userController.rendimento);

export default router;
