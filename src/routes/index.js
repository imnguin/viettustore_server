import { areaRouter } from "./area.js";
import { authenRouter } from "./authen.js";
import { branchRouter } from "./branch.js";
import { brandRouter } from "./brand.js";
import { priceRouter } from "./price.js";
import { productRouter } from "./product.js";
import { product_lotRouter } from "./product_lot.js";
import { quantityUnitRouter } from "./quantityUnit.js";
import { userRouter } from "./user.js";

export const Routers = [
    product_lotRouter,
    priceRouter,
    areaRouter,
    brandRouter,
    branchRouter,
    quantityUnitRouter,
    productRouter,
    userRouter,
    authenRouter
];