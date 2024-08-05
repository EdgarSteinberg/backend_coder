import { MessageService } from "../dao/services/messageService.js";
import MessageRepository from "./messageRepository.js";

import { UserService } from "../dao/services/userService.js";
import UserRepository from './userRepository.js'

import { ProductService } from "../dao/services/productService.js";
import ProductRepository from "./productRepository.js";


import { CartService } from "../dao/services/cartService.js";
import CartRepository from "./cartRepository.js";

import { TicketService } from "../dao/services/ticketService.js"
import TicketRepository from "./ticketRespository.js";

export const MessageServiceRepositori = new MessageRepository(new MessageService());

export const UserServiceRespository = new UserRepository(new UserService());

export const ProductServiceRespository = new ProductRepository(new ProductService());

export const CartServiceRepository = new CartRepository(new CartService());

export const TicketServiceRepository = new TicketRepository(new TicketService());