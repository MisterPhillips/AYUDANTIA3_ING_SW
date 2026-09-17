import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// 1. Middlewares globales: se ejecutan antes de buscar la ruta.
// cors permite peticiones desde otros orígenes.
app.use(cors());
// morgan registra cada petición en la terminal.
app.use(morgan('dev'));
// express.json() convierte el JSON recibido en req.body.
app.use(express.json());

// 2. Rutas: aquí se ejecutan las validaciones específicas y los controllers.
app.use('/api', apiRouter);

// 3. Si ninguna ruta coincide, se responde 404.
app.use((req, res) => {
  res.status(404).json({
    error: `Ruta no encontrada: [${req.method}] ${req.originalUrl}`
  });
});

// 4. Si un controller llama next(error), Express salta hasta este middleware.
// Por eso errorHandler se registra al final.
app.use(errorHandler);

export default app;
