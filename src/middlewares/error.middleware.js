import { Prisma } from '@prisma/client';

/**
 * Middleware centralizado para el manejo de errores.
 *
 * Se ejecuta después de que otro middleware o controller llama next(error).
 * Su objetivo es convertir errores técnicos de Prisma o del servidor en
 * respuestas JSON entendibles para el cliente.
 *
 * Los cuatro parámetros son importantes: Express reconoce esta función como
 * middleware de errores porque recibe err como primer parámetro.
 */
export const errorHandler = (err, req, res, next) => {
  // Muestra el error completo en la terminal para facilitar la revisión.
  console.error('💥 Error capturado:', err);

  // Primero se revisa si Prisma produjo un error conocido.
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: se intentó repetir un valor único, como name o sku.
    if (err.code === 'P2002') {
      const target = err.meta?.target ? err.meta.target.join(', ') : 'campo único';
      return res.status(409).json({
        error: `Conflicto: Ya existe un registro con el mismo valor para [${target}].`
      });
    }

    // P2025: se intentó actualizar o eliminar un registro inexistente.
    if (err.code === 'P2025') {
      return res.status(404).json({
        error: 'El recurso solicitado no fue encontrado en la base de datos.'
      });
    }

    // P2003: se usó una relación inexistente, como un categoryId inválido.
    if (err.code === 'P2003') {
      return res.status(400).json({
        error: 'La relación indicada no es válida (clave foránea inexistente).'
      });
    }
  }

  // Si el error no fue uno de los casos anteriores, se responde como error
  // interno. En desarrollo se incluye el mensaje técnico para depurar.
  return res.status(500).json({
    error: 'Error interno del servidor. Por favor intenta más tarde.',
    detalles: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};
