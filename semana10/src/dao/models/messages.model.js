import mongoose from 'mongoose'

const chatCollection = 'messages'

const chatSchema = new mongoose.Schema({
    user: {
        type: String,
        unique: true
    },
    message: String, 
});

const MessageModel = mongoose.model(chatCollection, chatSchema)

export default MessageModel