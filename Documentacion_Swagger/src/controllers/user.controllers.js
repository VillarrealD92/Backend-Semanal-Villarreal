import { userModel } from "../DAO/mongoDB/models/user.model.js";
import { logger } from "../utlis/loggerDev.js";

export const changeRole = async (req, res) => {
    try {
        const userActive = req.user.user;
        const userForChange = await userModel.findOne({ email: userActive.email });

        if (!userForChange) {
            logger.error("User not found");
            return res.status(404).send({ error: "User not found" });
        }

        if (userForChange.role === 'premium') {
            userForChange.role = 'user';
            await userModel.updateOne({ _id: userForChange._id }, userForChange);
            logger.info("Role of user changed to user");
            return res.send({ result: 'Role of user changed to user' });
        } else if (userForChange.role === 'user') {
            userForChange.role = 'premium';
            await userModel.updateOne({ _id: userForChange._id }, userForChange);
            logger.info("Role of user changed to premium");
            return res.send({ result: 'Role of user changed to premium' });
        } else {
            logger.error("Invalid user role");
            return res.status(400).send({ error: 'Invalid user role' });
        }
    } catch (error) {
        logger.error("Failed to change user role: " + error.message);
        return res.status(500).send({ error: 'Failed to change user role', message: error.message });
    }
};