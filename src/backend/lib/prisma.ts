import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_nJ5zXNfR4pIh@ep-aged-star-a1p312h1.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=15";

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
