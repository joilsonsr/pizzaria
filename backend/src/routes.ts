
import { Router } from "express";
import multer from 'multer';
import { CreateCategoryController } from "./controllers/category/CreateCategoryController";
import { ListCategoryController } from "./controllers/category/ListCatergoryContoller";
import { CreateProductController } from "./controllers/product/CreateProductController";
import { AuthUseContoller } from "./controllers/user/AuthUseContoller";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import uploadConfig from './config/multer'

const router = Router();
const upload = multer(uploadConfig.upload("./tmp"))
//-- ROTAS USER --
router.post('/users',new CreateUserController().handle)
router.post('/session', new AuthUseContoller().handle)
router.get('/me',isAuthenticated, new DetailUserController().handle)

// --ROTAS CATEGORY 
router.post('/category',isAuthenticated, new CreateCategoryController().handle)
router.get('/category',isAuthenticated,new ListCategoryController().handle)
export{ router};

//-- ROTAS PRODUCT
router.post('/product', isAuthenticated,upload.single('file'), new CreateProductController().handle)