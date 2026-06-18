import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getDatabaseUrl(): string {
  const tmpDb = '/tmp/flowerk.db'

  if (fs.existsSync(tmpDb)) {
    return `file:${tmpDb}`
  }

  const candidates = [
    path.join(process.cwd(), 'prisma', 'prisma', 'dev.db'),
    path.join(process.cwd(), 'prisma', 'dev.db'),
    path.join(__dirname, '..', '..', 'prisma', 'prisma', 'dev.db'),
    path.join(__dirname, '..', '..', 'prisma', 'dev.db'),
  ]

  for (const src of candidates) {
    try {
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, tmpDb)
        return `file:${tmpDb}`
      }
    } catch {}
  }

  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
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
