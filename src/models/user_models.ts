//src/models/user_models.ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName : { type: String, required: true },
    email    : { type: String, required: true, unique: true },
    password : { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    role     : { type: String, enum: ['Administrador', 'Usuario', 'Empresa', 'Gobierno'], default: 'Usuario' },

    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Drone', default: [] }]
  });
  

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.__v;
    return user;
};

export interface IUser {
    _id?: mongoose.Types.ObjectId;
    password: string;
    userName: string;
    email: string;
    isDeleted?: boolean;
    role: 'Administrador' | 'Usuario' | 'Empresa' | 'Gobierno';
    favorites?: mongoose.Types.ObjectId[];          
  }

const User = mongoose.model('User', userSchema);
export default User;
