import config from '../config/config.js';
import mongoose from 'mongoose';
import { programOPTS } from '../commander.js';

export let Products
export let Carts
export let Tickets

const { MONGO_DBNAME, MONGO_URL } = config

switch (programOPTS.p) {
    case 'MONGO':

        await mongoose.connect(MONGO_URL, { dbName: MONGO_DBNAME });

        const { default: ProductsMongo } = await import('./mongoDB/productManagerMDB.js');
        const { default: CartsMongo } = await import('./mongoDB/cartManagerMDB.js');
        const { default: TicketsMongo } = await import('./mongoDB/ticketManagerMDB.js');

        Products = ProductsMongo
        Carts = CartsMongo
        Tickets= TicketsMongo

        break;

    case 'FILE':

        const { default: ProductsFile } = await import('./fileSystem/productManager.js');
        const { default: CartsFile } = await import('./fileSystem/cartManager.js');

        Products = ProductsFile
        Carts = CartsFile

        break

    default:
        throw new Error('Persistence not recognized')
}