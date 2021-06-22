import { Request, Response } from 'express';
import Category from '../models/category';

class CategoryController {
  async find(request: Request, response: Response) {
    const category = await Category.find();

    response.status(200).json(category);
  }

  async add(request: Request, response: Response) {
    try {
      const newCategory = new Category({
        name: request.body.name,
        minIncome: request.body.minIncome,
        transactionLimit: request.body.transactionLimit,
        transactionTax: request.body.transactionTax,
      });
      response.status(200).json(newCategory.save());
    } catch (err) {
      console.log(err);
    }
  }

  async delete(request: Request, response: Response) {
    const category = await Category.findOneAndDelete({ _id: request.body.id });

    if (category === null) {
      response.status(400).json('Categoria não encontrada');
    } else {
      response.status(200).json('Categoria deletada com sucesso!');
    }
  }

  async update(request: Request, response: Response) {
    const id = request.body.id;
    const name = request.body.name;
    const minIncome = request.body.minIncome;
    const transactionLimit = request.body.transactionLimit;
    const transactionTax = request.body.transactionTax;

    let changes = {};

    if (name) Object.assign(changes, { name });
    if (minIncome) Object.assign(changes, { minIncome });
    if (transactionLimit) Object.assign(changes, { transactionLimit });
    if (transactionTax) Object.assign(changes, { transactionTax });

    const category = await Category.findOneAndUpdate({ _id: id }, changes);

    if (category)
      return response.status(200).json('Categoria alterada com sucesso.');

    return response.status(400).json('Não foi possível alterar a categoria.');
  }
}

export default CategoryController;
