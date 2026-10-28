import prisma from "./prisma";
import type { Shipment } from "@/lib/shipments";

function toShipment(record: {
  id: string;
  orderId: string;
  destination: string;
  carrier: string;
  status: string;
  expectedDelivery: Date;
  delayDays: number;
  reason: string | null;
}): Shipment {
  return {
    id: record.id,
    orderId: record.orderId,
    destination: record.destination,
    carrier: record.carrier,
    status: record.status.toLowerCase() as Shipment["status"],
    expectedDelivery: record.expectedDelivery.toISOString().slice(0, 10),
    delayDays: record.delayDays,
    reason: record.reason,
  };
}

export async function getDelayedShipments(): Promise<Shipment[]> {
  const records = await prisma.shipment.findMany({
    where: {
      status: "DELAYED",
      delayDays: { gt: 0 },
    },
    orderBy: { delayDays: "desc" },
  });

  return records.map(toShipment);
}

export async function getShipmentById(id: string): Promise<Shipment | null> {
  const record = await prisma.shipment.findUnique({
    where: { id },
  });

  return record ? toShipment(record) : null;
}
