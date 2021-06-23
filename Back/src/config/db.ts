import mongoose, { mongo } from 'mongoose';

mongoose
  .connect(
    'mongodb+srv://root:root123@cluster0.pplmm.mongodb.net/TES?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true },
  )
  .then(() => {
    console.log('Aplicatação conectada ao banco de dados!');
  })
  .catch(error => {
    console.log(`Erro ao conectar com o banco: ${error}`);
  });

export { mongoose };
