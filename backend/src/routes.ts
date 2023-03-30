import { Router } from "express";
import { CreateCategoryController } from "./controllers/category/CreateCategoryController";
import { ListCategoryController } from "./controllers/category/ListCatergoryContoller";
import { AuthUseContoller } from "./controllers/user/AuthUseContoller";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
const router = Router();
//-- ROTAS USER --
router.post('/users',new CreateUserController().handle)
router.post('/session', new AuthUseContoller().handle)
router.get('/me',isAuthenticated, new DetailUserController().handle)

// --ROTAS CATEGORY 
router.post('/category',isAuthenticated, new CreateCategoryController().handle)
router.get('/category',isAuthenticated,new ListCategoryController().handle)
export{ router};

//-- ROTAS PRODUCT