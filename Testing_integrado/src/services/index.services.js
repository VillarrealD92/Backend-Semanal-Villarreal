import { Products, Carts, Tickets } from "../DAO/factory.js";

import CartServices from "./carts.services.js";
import ProductServices from './products.services.js';
import TicketServices from "./ticket.services.js";

export const ProductRepository= new ProductServices(new Products());
export const CartRepository= new CartServices(new Carts());
export const TicketRepository= new TicketServices( new Tickets());