import prisma from '../config/prisma.js';

/**
 * Obtener todos los productos con filtros avanzados
 * GET /api/products?categoryId=1&minPrice=10000&maxPrice=50000&inStock=true
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const { categoryId, minPrice, maxPrice, inStock } = req.query; //query hace referencia a los parametros que se pasan en la url, por ejemplo: /api/products?categoryId=1&minPrice=10000&maxPrice=50000&inStock=true

    const where = {};

    if (categoryId !== undefined) {
      where.categoryId = Number(categoryId); //aca se valida que el categoryId sea un numero, si no lo es, se ignora el filtro
    }

    if (minPrice !== undefined || maxPrice !== undefined) { //aca se valida que el minPrice y maxPrice sean numeros, si no lo son, se ignora el filtro
      where.price = {};
      if (minPrice !== undefined) where.price.gte = Number(minPrice);
      if (maxPrice !== undefined) where.price.lte = Number(maxPrice);
    }

    if (inStock !== undefined) {
      const onlyInStock = inStock === true || inStock === 'true';
      where.stock = onlyInStock ? { gt: 0 } : 0;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      total: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener un producto por su ID
 * GET /api/products/:id
 */
export const getProductById = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

/**
 * Crear un nuevo producto
 * POST /api/products
 */
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, sku, isAvailable, categoryId } = req.body;

    // 1. Verificar si la categoría existe antes de asociarla
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!categoryExists) {
      return res.status(404).json({
        error: `La categoría con ID ${categoryId} no existe.`
      });
    }

    // 2. Crear el producto
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        sku,
        isAvailable: isAvailable ?? true,
        categoryId
      },
      include: {
        category: true
      }
    });

    res.status(201).json({
      mensaje: 'Producto creado exitosamente',
      data: newProduct
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar un producto existente
 * PUT /api/products/:id
 */
export const updateProduct = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const updateData = { ...req.body };

    // Si intenta cambiar de categoría, validar que exista
    if (updateData.categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: updateData.categoryId }
      });
      if (!categoryExists) {
        return res.status(404).json({
          error: `La categoría con ID ${updateData.categoryId} no existe.`
        });
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: {
        category: true
      }
    });

    res.status(200).json({
      mensaje: 'Producto actualizado exitosamente',
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar un producto
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);

    await prisma.product.delete({
      where: { id: productId }
    });

    res.status(200).json({
      mensaje: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};
