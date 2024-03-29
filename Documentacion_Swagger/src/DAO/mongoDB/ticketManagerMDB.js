import CartManagerDB from "./cartManagerMDB.js";
import ProductManagerMDB from "./productManagerMDB.js";
import { userModel } from "./models/user.model.js";
import { ticketModel } from './models/ticket.model.js';
import { logger } from "../../utlis/loggerDev.js";

const productsDB = new ProductManagerMDB();
const cartsDB = new CartManagerDB();

function generarCode() {
  const caracteres = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let resultado = '';

  for (let i = 0; i < 10; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    resultado += caracteres.charAt(indiceAleatorio);
  }

  return resultado;
}

class TicketManager {

    async createTicket(cid, user) {
        try {
            const cartSearch = await cartsDB.getCartById(cid);
            const clientSearch = await userModel.findOne({ email: user.email });

            if (!cartSearch || !clientSearch) {
                throw new Error('Cart or user not found');
            }

            const userEmail = clientSearch.email;

            let totalPurchase = 0;
            let purchasedProducts = [];
            let rejectedProducts = [];

            for (let product of cartSearch.products) {
                let quantity = product.quantity;
                let productInCart = product.product;

                let productMDB = await productsDB.getProductById(productInCart._id.toString());

                if (!productMDB) {
                    throw new Error('Product not found');
                }

                let stock = productMDB.stock;
                let price = productMDB.price;

                if (quantity <= stock) {
                    let newStock = stock - quantity;
                    let updatedStock = { stock: newStock };
                    await productsDB.updateProduct(productInCart._id.toString(), updatedStock);

                    totalPurchase += quantity * price;
                    purchasedProducts.push(product);
                } else {
                    rejectedProducts.push(product);
                }
            }

            const miString = generarCode();

            if (totalPurchase > 0) {
                let ticket = {
                    code: miString,
                    purchase_dateTime: new Date(),
                    amount: totalPurchase,
                    purchaser: userEmail
                }

                const FinalTicket = await ticketModel.create(ticket);
                const result = await cartsDB.overwriteCart(cid, rejectedProducts);

                logger.info('Ticket created successfully');
                return FinalTicket;
            }
        } catch (error) {
            logger.error('Error in createTicket: ' + error.message);
            return error;
        }
    }
}

export default TicketManager;