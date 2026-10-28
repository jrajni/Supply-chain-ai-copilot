import { PrismaClient } from "../src/generated/prisma/client";
import { shipments } from "../src/lib/shipments";

const prisma = new PrismaClient();

async function main() {
  for (const shipment of shipments) {
    const data = {
      ...shipment,
      status: shipment.status.toUpperCase() as
        | "IN_TRANSIT"
        | "DELIVERED"
        | "DELAYED",
      expectedDelivery: new Date(shipment.expectedDelivery),
    };

    await prisma.shipment.upsert({
      where: { id: shipment.id },
      update: data,
      create: data,
    });
  }

  console.log(`Seeded ${shipments.length} shipments successfully.`);
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
