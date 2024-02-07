import config from '../config/config.js';
import mongoose from 'mongoose';
import { programOPTS } from '../commander.js';

export let Products
export let Carts

const { MONGO_DBNAME, MONGO_URL } = config

switch (programOPTS.p) {
    case 'MONGO':

        await mongoose.connect(MONGO_URL, { dbName: MONGO_DBNAME });
        console.log('Connected with MongoDB')

        const { default: ProductsMongo } = await import('./mongo/manager/mongo.product.manager.js');
        const { default: CartsMongo } = await import('./mongo/manager/mongo.cart.manager.js');

        Products = ProductsMongo
        Carts = CartsMongo

        break;

    case 'FILE':

        console.log('Connected with File')

        const { default: ProductsFile } = await import('./fsManagers/ProductManager.js');
        const { default: CartsFile } = await import('./fsManagers/CartsManager.js');

        Products = ProductsFile
        Carts = CartsFile

        break

    default:
        throw new Error('Persistence not recognized')
}