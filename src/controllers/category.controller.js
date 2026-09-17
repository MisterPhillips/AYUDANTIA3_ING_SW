import prisma from '../config/prisma.js';//permite concestarse y ocupar la base de datos

/**
 * Obtener todas las categorías incluyendo el conteo de productos
 * GET /api/categories
 */
export const getAllCategories = async (req, res, next) => {
  try {
    // Consulta todas las categorías en la tabla "categories".
    // "await" espera la respuesta de la base de datos antes de continuar.
    const categories = await prisma.category.findMany({ //findmany es equivalente a SELECT * FROM categories;
      // Incluye información adicional relacionada con cada categoría.
      include: {//include permite traer información de otras tablas relacionadas, en este caso la tabla products y mas información de la tabla categories
        _count: { // count lo trae por defecto el prisma, pero se puede especificar que solo traiga el conteo de productos
          // Cuenta cuántos productos pertenecen a cada categoría.
          // No trae todos los productos, solo entrega el número.
          select: { products: true }
        }
      },
      // Ordena las categorías alfabéticamente por su nombre.
      orderBy: {
        name: 'asc'// 'asc' → ascendente (A→Z, 0→9, fecha más antigua primero) 'desc' → descendente (Z→A, 9→0, fecha más reciente primero)
      }
    });

    // Envía una respuesta HTTP 200 (consulta exitosa) en formato JSON.
    res.status(200).json({
      // Informa cuántas categorías se encontraron.
      total: categories.length,
      // Entrega el arreglo con las categorías y sus conteos de productos.
      data: categories
    });
  } catch (error) {
    // Si ocurre un error, lo pasa al middleware global de errores.
    next(error);
  }
};

/**
 * Obtener una categoría por ID con sus productos
 * GET /api/categories/:id
 */
export const getCategoryById = async (req, res, next) => {
  try {
    const categoryId = Number(req.params.id); //req dato que ingresa el usuario, params es un objeto que contiene los parámetros de la ruta, en este caso el id de la categoría. Number convierte el valor a número.

    const category = await prisma.category.findUnique({ // el findUnique es equivalente a SELECT * FROM categories WHERE id = categoryId;
      where: { id: categoryId },
      include: { //como no hay select trae todo los campos de la tabla categories y products, pero si se quiere traer solo algunos campos se puede usar select
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            sku: true,
            isAvailable: true
          }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

/**
 * Crear una nueva categoría
 * POST /api/categories
 */
export const createCategory = async (req, res, next) => { //donde el cliente (frontend, Postman, etc.) manda datos en el cuerpo de la petición para crear una nueva categoría.
  try {
    const { name, description } = req.body; //req.body es un objeto que contiene los datos enviados por el cliente en el cuerpo de la petición. En este caso, se espera que el cliente envíe un objeto JSON con las propiedades name y description para crear una nueva categoría. los otro datos de llenan solo 

    const newCategory = await prisma.category.create({
      data: {
        name,
        description
      }
    });

    res.status(201).json({
      mensaje: 'Categoría creada exitosamente',
      data: newCategory
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar una categoría existente
 * PUT /api/categories/:id
 */
export const updateCategory = async (req, res, next) => {
  try {
    const categoryId = Number(req.params.id);
    const { name, description } = req.body;

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        description
      }
    });

    res.status(200).json({
      mensaje: 'Categoría actualizada exitosamente',
      data: updatedCategory
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar una categoría
 * DELETE /api/categories/:id
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = Number(req.params.id);

    // Verificar si la categoría tiene productos asociados
    const count = await prisma.product.count({
      where: { categoryId }
    });

    if (count > 0) {
      return res.status(400).json({
        error: `No se puede eliminar la categoría porque tiene ${count} producto(s) asociado(s).`
      });
    }

    await prisma.category.delete({
      where: { id: categoryId }
    });

    res.status(200).json({
      mensaje: 'Categoría eliminada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};
