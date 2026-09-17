import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando carga de datos de prueba (Seed)...');

  // Limpiar base de datos previa (orden por restricciones de clave foránea)
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 1. Crear Categorías
  const electronica = await prisma.category.create({
    data: {
      name: 'Electrónica',
      description: 'Dispositivos inteligentes, computadores, audio y accesorios.'
    }
  });

  const hogar = await prisma.category.create({
    data: {
      name: 'Hogar y Oficina',
      description: 'Muebles ergonómicos, iluminación y artículos de escritorio.'
    }
  });

  const accesorios = await prisma.category.create({
    data: {
      name: 'Accesorios',
      description: 'Cables, adaptadores, mochilas y fundas protectoras.'
    }
  });

  // 2. Crear Productos asociados
  const p1 = await prisma.product.create({
    data: {
      name: 'Laptop Gamer Pro 16"',
      description: 'Intel i7, 32GB RAM, RTX 4070, 1TB SSD NVMe.',
      price: 1299990,
      stock: 15,
      sku: 'TECH-LAP-001',
      isAvailable: true,
      categoryId: electronica.id
    }
  });

  const p2 = await prisma.product.create({
    data: {
      name: 'Mouse Ergonómico Inalámbrico',
      description: 'Sensor óptico 4000 DPI, batería recargable vía USB-C.',
      price: 34990,
      stock: 50,
      sku: 'TECH-MOU-002',
      isAvailable: true,
      categoryId: electronica.id
    }
  });

  const p3 = await prisma.product.create({
    data: {
      name: 'Silla de Oficina Ergonómica',
      description: 'Soporte lumbar ajustable, malla transpirable y apoyabrazos 3D.',
      price: 189990,
      stock: 8,
      sku: 'HOG-SIL-001',
      isAvailable: true,
      categoryId: hogar.id
    }
  });

  const p4 = await prisma.product.create({
    data: {
      name: 'Mochila Impermeable para Notebook 16"',
      description: 'Compartimento acolchado, puerto USB externo y tela antirayaduras.',
      price: 29990,
      stock: 0,
      sku: 'ACC-MOC-001',
      isAvailable: false,
      categoryId: accesorios.id
    }
  });

  console.log('✅ Base de datos poblada exitosamente:');
  console.log(`- 3 Categorías creadas: [${electronica.name}, ${hogar.name}, ${accesorios.name}]`);
  console.log(`- 4 Productos creados: [${p1.name}, ${p2.name}, ${p3.name}, ${p4.name}]`);
}

main()
  .catch((e) => {
    console.error('❌ Error al ejecutar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

  // Comandos principales:
  // 1. Si cambiaste schema.prisma, actualiza la estructura de la base de datos:
  //    npm run prisma:migrate
  //    También puedes ponerle un nombre a la migración:
  //    npm run prisma:migrate -- --name nombre-del-cambio
  //
  // 2. Si necesitas cargar o reiniciar los datos de prueba de este archivo:
  //    npm run prisma:seed
  //    Atención: este seed elimina primero todos los productos y categorías.
  //
  // 3. Para iniciar la API en modo desarrollo:
  //    npm run dev
  //
  // Si solo crearás un producto o una categoría desde Postman, no necesitas
  // ejecutar migrate ni seed. Usa directamente los endpoints de la API.