import { userModel } from "../DAO/mongoDB/models/user.model.js";

export const changeRole = async (req, res) => {

    const userActive = req?.user?.user

    const userForChangue = await userModel.findOne({ email: userActive.email });

    const roleNewForUser = userForChangue;

    if (userForChangue.role == 'premium') {
        roleNewForUser.role = 'user'
        await userModel.updateOne({ _id: userForChangue._id }, roleNewForUser)
        res.send({ result: 'Role of user was changed for user' })
    }

    if(userForChangue.role == 'user'){
        roleNewForUser.role = 'premium'
        await userModel.updateOne({ _id: userForChangue._id }, roleNewForUser)
        res.send({ result: 'Role of user was changed for premium' })
    }

}