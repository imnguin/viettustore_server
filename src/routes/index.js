import { authenRouter } from "./authen.js";
import { productRouter } from "./product.js";
import { quantityUnitRouter } from "./quantityUnit.js";
import { userRouter } from "./user.js";

export const Routers = [
    quantityUnitRouter,
    productRouter,
    userRouter,
    authenRouter
];