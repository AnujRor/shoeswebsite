import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import categoriesRouter from "./categories";
import brandsRouter from "./brands";
import cartRouter from "./cart";
import ordersRouter from "./orders";
import contactRouter from "./contact";
import storeRouter from "./store";
import chatRouter from "./chat";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(categoriesRouter);
router.use(brandsRouter);
router.use(cartRouter);
router.use(ordersRouter);
router.use(contactRouter);
router.use(storeRouter);
router.use(chatRouter);

export default router;
