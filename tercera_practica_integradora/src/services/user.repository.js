
export default class UserRepository {
    constructor(dao){
        this.dao=dao
    }

    createUser = async (newUser) => {
        return await this.dao.create(newUser)
    }

    getUserByEmail = async (username) => {
        return await this.dao.getByData(username)
    }

    getUserById = async (id) => {
        return await this.dao.getById(id)
    }

    updateUser = async (email, changes) => {
        return await this.dao.update(email, changes)
    }

    deleteUser = async (userId) => {
        return await this.dao.delete(userId)
    }
}