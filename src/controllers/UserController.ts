import { Request, Response } from "express";
import User from "../models/user";

class UserController {
  async find(request: Request, response: Response) {
    const users = await User.find();

    response.status(200).json(users);
  }
  async add(request: Request, response: Response) {
    try {
      const newUser = new User({
        name: request.body.name,
        currency: request.body.currency,
        cpf: request.body.cpf,
        age: request.body.age,
        income: request.body.income,
      });

      response.status(200).json(newUser.save());
    } catch (err) {
      console.log(err);
    }
  }
}

export default UserController;
