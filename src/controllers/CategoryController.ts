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
            transactionTax: request.body.transactionTax
          });
          response.status(200).json(newCategory.save());
        } catch (err) {
          console.log(err);
        }
      }
      
      async deleteCategory(request: Request, response: Response) {
        const name = request.body.name;
        const filter = { name : name };
        const category = await category.findOneAndDelete(filter);
    
        if (name == null) {
          response
            .status(400)
            .json("Não existe nenhuma Categoria com esse Nome para ser deletada");
        } else {
          response.status(200).json("Categoria deletada com sucesso!");
        }
      }
}

export default CategoryController;
