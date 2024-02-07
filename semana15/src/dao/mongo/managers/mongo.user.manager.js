import UserModel from "../models/user.model.js";

class MongoUserManager{
    constructor(){
        this.model = UserModel
    }
   
    create = async (newUser) => {
        return await UserModel.create(newUser)
    }

    getByData = async (username) => {
        return await UserModel.findOne({ email: username }).lean().exec()
    }

    getById = async (id) => {
        return await UserModel.findById(id)
    }

    update = async (email, changes) => {
        return await UserModel.updateOne({email: email}, { $set: { changes } })
    }

    delete = async (userId) => {
        return await UserModel.deleteOne({_id: userId})
    }
}

export default MongoUserManager