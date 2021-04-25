import { Request, Response } from "express";
import User from "../models/user";
import Category from "../models/category";
import user from "../models/user";

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

    } catch (err) {
      console.log(err);
    }
  }

  async deposit(request: Request, response: Response) {
    try {
      const cpf = request.body.cpf;
      const depositValue = request.body.currency;
      
      if(depositValue <= 0) {
        response.status(400).json("Não é possível depositar um valor negativo!");
      } else {
        const filter = { cpf: cpf };
        const update = { currency: depositValue };
        const user = await User.findOneAndUpdate(filter, update);
        
        if(user == null){
          response.status(400).json("Não existe nenhum usuário cadastrado no sistema");
        } else {
          
          response.status(200).json("Depósito realizado com sucesso");
        }
      }

    } catch (err) {
      console.log(err);
    }
  }
}

export default UserController;
