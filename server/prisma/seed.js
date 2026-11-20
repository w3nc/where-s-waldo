// Fills in the 3 characters. Safe to run many times (upsert = insert or update).
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const characters = [
  { name: 'Waldo', x: 0.6343, y: 0.874, radius: 0.02 },
  { name: 'Wizard', x: 0.7807, y: 0.5775, radius: 0.02 },
  { name: 'Wilma', x: 0.3085, y: 0.6423, radius: 0.02 },
];

async function main() {
  for (const c of characters) {
    await prisma.character.upsert({
      where: { name: c.name },
      update: { x: c.x, y: c.y, radius: c.radius },
      create: c,
    });
  }
  console.log(`Seeded ${characters.length} characters.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
