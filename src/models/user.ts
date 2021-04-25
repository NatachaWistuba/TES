import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  cpf: { type: String, required: true },
  age: { type: Number, required: true },
  income: { type: Number, required: true },
  currency: { type: Number, required: true },
  categoryId: { type: String },
});

export default mongoose.model('User', UserSchema);
