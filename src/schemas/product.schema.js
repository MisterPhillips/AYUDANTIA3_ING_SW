import { z } from 'zod'; // se debe instalar zod para poder validar los datos de entrada, con npm install zod

// Esquema para crear un producto (POST)
export const createProductSchema = z.object({
  name: z
    .string({ required_error: 'El nombre del producto es obligatorio' })
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(150, 'El nombre no puede exceder los 150 caracteres')
    .trim(),
  description: z
    .string()
    .max(1000, 'La descripción no puede superar los 1000 caracteres')
    .optional(),
  price: z
    .number({ required_error: 'El precio es obligatorio' })
    .positive('El precio debe ser un número mayor a 0'),
  stock: z
    .number({ required_error: 'El stock es obligatorio' })
    .int('El stock debe ser un número entero')
    .nonnegative('El stock no puede ser negativo')
    .default(0),
  sku: z
    .string({ required_error: 'El código SKU es obligatorio' })
    .min(3, 'El SKU debe tener al menos 3 caracteres')
    .max(50, 'El SKU no puede superar los 50 caracteres')
    .toUpperCase()
    .trim(),
  isAvailable: z
    .boolean()
    .optional()
    .default(true),
  categoryId: z
    .number({ required_error: 'El ID de la categoría es obligatorio' })
    .int('El ID de categoría debe ser un número entero')
    .positive('El ID de categoría debe ser positivo')
});

// Esquema para actualizar un producto (PUT / PATCH)
export const updateProductSchema = createProductSchema.partial();

// Esquema para validar parámetros numéricos en la URL (:id)
export const productIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'El ID del producto debe ser un número entero')
    .transform(Number)
});

// Esquema para validar filtros en la URL (?minPrice=&maxPrice=&categoryId=&inStock=)
export const productQuerySchema = z.object({
  categoryId: z.string().regex(/^\d+$/).transform(Number).optional(),
  minPrice: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  maxPrice: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  inStock: z.enum(['true', 'false']).transform((val) => val === 'true').optional()
});
