import { authenRouter } from "./authen.js";
import { productRouter } from "./product.js";
import { userRouter } from "./user.js";

export const Routers = [
    productRouter,
    userRouter,
    authenRouter
];