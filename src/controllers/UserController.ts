import { Request, Response } from "express";
import User from "../models/user";
import Category from "../models/category";

class UserController {
  async find(request: Request, response: Response) {
    const users = await User.find();

    response.status(200).json(users);
  }
  async add(request: Request, response: Response) {
    try {
      const newUser = new User({
        name: request.body.name,
        cpf: request.body.cpf,
        age: request.body.age,
        income: request.body.income,
        currency: request.body.currency,
      });

      const categories = await Category.find(); // precisa ordenar pelo valor minimo da categoria (income)

      console.log(categories);

      var idCategory = 0;

      for(let element of categories){
        if(newUser.income >= element.minIncome){
          idCategory = element._id; //sabe o elemento do id da categoria, que se enquadra ao income do user
        }
      }

      if(idCategory == 0){
        response.status(400).json("Não existe nenhuma categoria para este usuário");
      } else {
        newUser.categoryId = idCategory;
        response.status(200).json(newUser.save());
      }

      console.log(categories);
      // response.status(200).json("teste"); ta ae ? 
    } catch (err) {
      console.log(err);
    }
  }

  // async transfer(request: Request, response: Response) {
  //   try {

  //   } catch () {

  //   }
  // }
}

export default UserController;
