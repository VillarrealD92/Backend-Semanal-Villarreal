import UserModel from "../models/user.model.js";

class MongoUserManager{
    constructor(){
        this.model = UserModel;
    }
   
    create = async (newUser) => {
        return await UserModel.create(newUser);
    }

    getByData = async (username) => {
        return await UserModel.findOne({ email: username }).lean().exec();
    }

    getById = async (id) => {
        return await UserModel.findById(id);
    }

    update = async (userId, changes) => {
        return await UserModel.updateOne({_id: userId}, { $set: changes }); // Cambio de 'email' a '_id'
    }

    delete = async (userId) => {
        return await UserModel.deleteOne({_id: userId});
    }

    uploadUserDocuments = async (userId, documents) => {
        try {
            const user = await this.model.findById(userId);

            if (!user) {
                throw new Error("Usuario no encontrado.");
            }

            user.documents = documents.map(document => ({
                name: document.originalname,
                reference: document.path 
            }));

            await user.save();

            return user;
        } catch (error) {
            throw error; 
        }
    }

    updateUserToPremium = async (userId) => {
        try {
            const user = await this.model.findById(userId);

            if (!user) {
                throw new Error("Usuario no encontrado.");
            }

            user.role = "premium"; // Actualiza el rol del usuario a "premium"
            await user.save(); // Guarda los cambios en la base de datos

            return user; // Devuelve el usuario actualizado
        } catch (error) {
            throw error; // Lanza el error si ocurre alguno
        }
    }
}

export default MongoUserManager;