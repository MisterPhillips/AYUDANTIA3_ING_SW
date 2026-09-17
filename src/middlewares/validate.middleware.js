/**
 * Middleware genérico de validación con Zod.
 *
 * Esta función recibe un schema y devuelve el middleware que Express ejecuta
 * antes del controller. Se usa para validar body, params o query.
 * @param {import('zod').ZodSchema} schema - Esquema de validación de Zod
 * @param {'body' | 'params' | 'query'} [target='body'] - Parte de la petición a validar
 */
export const validate = (schema, target = 'body') => {
  return (req, res, next) => {
    // Lee la parte indicada de la petición. Por ejemplo, si target es
    // 'body', aquí se valida req.body.
    // safeParse devuelve un resultado y no lanza una excepción.
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      // La petición tiene datos inválidos. Se responde aquí y el controller
      // no se ejecuta porque no se llama a next().
      // Se convierten los errores de Zod en un formato legible.
      const errors = result.error.errors.map((err) => ({
        campo: err.path.join('.'),
        mensaje: err.message
      }));

      return res.status(400).json({
        error: 'Error de validación en los datos enviados',
        detalles: errors
      });
    }

    // Guarda los datos después de validarlos y transformarlos con Zod.
    // Por ejemplo, un id puede convertirse de texto a número.
    req[target] = result.data;

    // Los datos son correctos: continúa hacia el siguiente middleware o
    // hacia el controller definido en la ruta.
    next();
  };
};
