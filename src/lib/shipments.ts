export type Shipment = {
  id: string;
  orderId: string;
  destination: string;
  carrier: string;
  status: "in_transit" | "delivered" | "delayed";
  expectedDelivery: string;
  delayDays: number;
  reason: string | null;
};

export const shipments: Shipment[] = [
  {
    id: "SHP-1001",
    orderId: "PO-5001",
    destination: "Mumbai",
    carrier: "BlueDart",
    status: "delayed",
    expectedDelivery: "2026-10-22",
    delayDays: 2,
    reason: "Weather disruption",
  },
  {
    id: "SHP-1002",
    orderId: "PO-5002",
    destination: "Bengaluru",
    carrier: "Delhivery",
    status: "in_transit",
    expectedDelivery: "2026-10-26",
    delayDays: 0,
    reason: null,
  },
  {
    id: "SHP-1003",
    orderId: "PO-5003",
    destination: "Hyderabad",
    carrier: "DHL",
    status: "delayed",
    expectedDelivery: "2026-10-21",
    delayDays: 3,
    reason: "Customs clearance",
  },
  {
    id: "SHP-1004",
    orderId: "PO-5004",
    destination: "Pune",
    carrier: "BlueDart",
    status: "delivered",
    expectedDelivery: "2026-10-23",
    delayDays: 0,
    reason: null,
  },
  {
    id: "SHP-1005",
    orderId: "PO-5005",
    destination: "Chennai",
    carrier: "Delhivery",
    status: "delayed",
    expectedDelivery: "2026-10-20",
    delayDays: 4,
    reason: "Warehouse processing backlog",
  },
];
