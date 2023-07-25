/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
import fs from 'fs';
import path from 'path';

import { PrismaClient } from '@prisma/client';

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  const globalWithPrisma = global;
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}

async function seedDatabase() {
  const filePath = path.resolve('./updatedContracts.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const contracts = JSON.parse(rawData);

  for (const address in contracts) {
    const token = contracts[address];
    if (token) {
      const { name, type, abi } = token;
      await prisma.contract.upsert({
        where: { address },
        update: { name, type, abi },
        create: { address, name, type, abi },
      });
    }
  }
}

seedDatabase()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
