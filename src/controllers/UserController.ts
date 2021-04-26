import { Request, Response } from 'express';
import User from '../models/user';
import Category from '../models/category';
import user from '../models/user';

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

      const filter = { cpf: newUser.cpf };
      const user = await User.findOne(filter);

      if (user == null) {
        const categories = await Category.find(); // precisa ordenar pelo valor minimo da categoria (income)

        var idCategory = 0;

        for (let element of categories) {
          if (newUser.income >= element.minIncome) {
            idCategory = element._id; //sabe o elemento do id da categoria, que se enquadra ao income do user
          }
        }

        if (idCategory == 0) {
          response
            .status(400)
            .json('Não existe nenhuma categoria para este usuário');
        } else {
          newUser.categoryId = idCategory;
          response.status(200).json(newUser.save());
        }
      } else {
        response
          .status(400)
          .json('Já existe um usuário cadastrado com esse CPF!');
      }
    } catch (err) {
      console.log(err);
    }
  }

  async deleteUser(request: Request, response: Response) {
    const cpf = request.body.cpf;
    const filter = { cpf: cpf };
    const user = await User.findOneAndDelete(filter);

    if (user == null) {
      response
        .status(400)
        .json("Não existe nenhum usuário com esse CPF para ser deletado");
    } else {
      response.status(200).json("Usuário deletado com sucesso!");
    }
  }

  async deposit(request: Request, response: Response) {
    try {
      const cpf = request.body.cpf;
      const depositValue = request.body.currency;

      if (depositValue <= 0) {
        response
          .status(400)
          .json('Não é possível depositar um valor negativo!');
      } else {
        const filter = { cpf: cpf };
        const update = { currency: depositValue };
        const user = await User.findOneAndUpdate(filter, update);

        if (user == null) {
          response
            .status(400)
            .json('Não existe nenhum usuário cadastrado no sistema');
        } else {
          response.status(200).json('Depósito realizado com sucesso');
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async saque(request:Request, response: Response) {
    try {
      const cpf = request.body.cpf;
      const valorDeSaque = request.body.currency;
      const filter = {cpf: cpf}
      const user = await User.findOne(filter);
      const saldoUsuario = user.currency;

      const saldoExtraido = saldoUsuario - valorDeSaque;

      if(valorDeSaque <= 0){
        response
          .status(400)
          .json("Não é possível sacar um valor negativo!");
      } else if (saldoExtraido < 0) {
        response
        .status(400)
        .json("Saldo insuficiente em conta para reailzar o saque!");
      } else{
        const filter = {cpf: cpf};
        const update = {currency: saldoExtraido};
        const user = await User.findOneAndUpdate(filter, update);
        
        if (user == null) {
          response
            .status(400)
            .json("Não existe nenhum usuário cadastrado no sistema");
        } else {
          response.status(200).json("Saque realizado com sucesso");
        }

      }

    } catch(err) {
      console.log(err);
    }
  }

  async transfer(request: Request, response: Response) {
    const cpfOrigem = request.body.cpfOrigem;
    const cpfDestino = request.body.cpfDestino;
    const valorTransferido = request.body.valorTransferido;

    if (valorTransferido <= 0) {
      response
        .status(400)
        .json('O valor  de transferência precisa ser maior do que R$0.00!');
    } else {
      const filterCpfOrigem = { cpf: cpfOrigem };
      const filterCpfDestino = { cpf: cpfDestino };
      const userOrigem = await User.findOne(filterCpfOrigem);
      const userDestino = await User.findOne(filterCpfDestino);

      if (userOrigem == null) {
        response.status(400).json('Não existe usuário origem!');
      } else if (userDestino == null) {
        response.status(400).json('Não existe usuário destino!');
      } else {
        const categoriaUsuarioOrigem = await Category.findById(
          userOrigem.categoryId,
        );
        if (valorTransferido > categoriaUsuarioOrigem.transactionLimit) {
          response
            .status(400)
            .json(
              'Limite máximo para realizar uma transferência foi ultrapassado!',
            );
        } else {
          const valorDescontadoComTaxa =
            valorTransferido +
            valorTransferido * categoriaUsuarioOrigem.transactionTax;
          const saldoDescontadoComTaxaDoUsuarioOrigem =
            userOrigem.currency - valorDescontadoComTaxa;
          if (saldoDescontadoComTaxaDoUsuarioOrigem < 0) {
            response
              .status(400)
              .json(
                'Saldo insuficiente na conta para realizar a transferência!',
              );
          } else {
            const updateUsuarioOrigem = {
              currency: saldoDescontadoComTaxaDoUsuarioOrigem,
            };
            await User.findByIdAndUpdate(
              { _id: userOrigem._id },
              updateUsuarioOrigem,
            );
            const saldoFinalComValorTransferido =
              valorTransferido + userDestino.currency;
            const updateUsuarioDestino = {
              currency: saldoFinalComValorTransferido,
            };
            await User.findByIdAndUpdate(
              { _id: userDestino._id },
              updateUsuarioDestino,
            );
            response.status(200).json('Transferencia realizada com sucesso!');
          }
        }
      }
    }
  }

  //async rendimento (request: Request, response: Response)
  //{
   // const cpf = request.body.cpf;
    //const filter = {cpf: cpf}
   // const user = await User.findOne(filter);
   // const saldoUsuario = user.currency;
   // const rendimento = saldoUsuario + (saldoUsuario*0.5);

  //  if (saldoUsuario < 0)
  //  {
   //   response 
   //   .status(400)
   //   .json ("Náo é possível obter rendimentos em uma conta zerada");

  //  } else {
   //   const filter = { cpf: cpf };
   //   const update = { currency: rendimento};
   //   const user = await User.findOneAndUpdate(filter, update);

    //  if (user == null) {
     //   response
     //     .status(400)
     //     .json("Não existe nenhum usuário cadastrado no sistema");
    //  } else {
    //    response.status(200).json("Rendimento realizado com sucesso");
    ///  }

   // }

    


  //}
}

export default UserController;
