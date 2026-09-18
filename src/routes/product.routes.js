import { Router } from 'express';
import {
  getAllProducts, //son las funciones que se encuentran en el controller y que se ejecutan cuando se hace una petición a la ruta correspondiente
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createProductSchema,
  updateProductSchema,
  productIdParamSchema,
  productQuerySchema
} from '../schemas/product.schema.js';

const router = Router();

// Endpoints de Productos
router.get('/', validate(productQuerySchema, 'query'), getAllProducts);
router.get('/:id', validate(productIdParamSchema, 'params'), getProductById);
router.post('/', validate(createProductSchema, 'body'), createProduct);
router.put('/:id', validate(productIdParamSchema, 'params'), validate(updateProductSchema, 'body'), updateProduct);
router.delete('/:id', validate(productIdParamSchema, 'params'), deleteProduct);

export default router;
