import { areaRouter } from "./area.js";
import { authenRouter } from "./authen.js";
import { branchRouter } from "./branch.js";
import { brandRouter } from "./brand.js";
import { productRouter } from "./product.js";
import { quantityUnitRouter } from "./quantityUnit.js";
import { userRouter } from "./user.js";

export const Routers = [
    areaRouter,
    brandRouter,
    branchRouter,
    quantityUnitRouter,
    productRouter,
    userRouter,
    authenRouter
];