import mongoose from "mongoose";

const collectionName= 'tickets';

const ticketSchema= new mongoose.Schema({
    code:{type: String, required:true, unique:true},
    purchase_dateTime:{type: String, required:true},
    amount:{type: Number, required:true},
    purchaser:{type: String, required:true},
});

export const ticketModel= mongoose.model(collectionName, ticketSchema);