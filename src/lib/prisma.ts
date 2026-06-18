import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }
  const candidates = [
    path.join(process.cwd(), 'prisma', 'prisma', 'dev.db'),
    path.join(process.cwd(), 'prisma', 'dev.db'),
    path.join(__dirname, '..', '..', 'prisma', 'prisma', 'dev.db'),
    path.join(__dirname, '..', '..', 'prisma', 'dev.db'),
  ]
  for (const p of candidates) {
    try { if (fs.existsSync(p)) return `file:${p}` } catch {}
  }
  return 'file:./prisma/dev.db'
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: { url: getDatabaseUrl() },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
