type KnowledgeDocument = {
  id: string;
  title: string;
  content: string;
};

export type KnowledgeChunk = {
  id: string;
  title: string;
  content: string;
};

const documents: KnowledgeDocument[] = [
  {
    id: "SOP-001",
    title: "Delayed Shipment Procedure",
    content:
      "When a shipment is delayed, first verify the latest carrier tracking status. Identify the delay reason and estimate the impact on the promised delivery date. Notify the customer if the delivery commitment is at risk. Escalate delays exceeding 48 hours to the logistics operations team. Record the reason, owner, and next follow-up time.",
  },
  {
    id: "SOP-002",
    title: "Customs Clearance Procedure",
    content:
      "For international shipments held in customs, verify that the commercial invoice, packing list, product description, and required permits are complete. Contact the customs broker to identify missing documents or duties. Do not promise a new delivery date until the broker confirms the expected release. Escalate unresolved customs holds to the trade compliance team.",
  },
  {
    id: "SOP-003",
    title: "Warehouse Processing Backlog",
    content:
      "When warehouse processing causes a shipment delay, check the order release status, inventory availability, picking queue, and packing status. Contact the warehouse supervisor for the backlog estimate. Prioritize urgent customer orders according to the approved fulfillment policy and communicate revised delivery estimates only after confirmation.",
  },
  {
    id: "SOP-004",
    title: "Customer Delivery Communication",
    content:
      "When a delivery commitment changes, communicate the known delay reason, the latest confirmed delivery estimate, and the next update time. Do not invent delivery dates or state an unconfirmed cause as fact. Record customer communication and follow up when new carrier or warehouse information becomes available.",
  },
];

function tokenize(text: string): string[] {
  return (
    text
      .toLowerCase()
      .match(/[a-z0-9]+/g)
      ?.filter((word) => word.length > 2) ?? []
  );
}

function splitIntoChunks(document: KnowledgeDocument): KnowledgeChunk[] {
  // These sample SOPs are short, so each document is one chunk.
  return [
    {
      id: document.id,
      title: document.title,
      content: document.content,
    },
  ];
}

const knowledgeChunks = documents.flatMap(splitIntoChunks);

export function retrieveKnowledge(
  question: string,
  limit = 3,
): KnowledgeChunk[] {
  const questionWords = new Set(tokenize(question));

  if (questionWords.size === 0) return [];

  const scored = knowledgeChunks
    .map((chunk) => {
      const titleWords = tokenize(chunk.title);
      const contentWords = tokenize(chunk.content);

      const titleMatches = titleWords.filter((word) =>
        questionWords.has(word),
      ).length;

      const contentMatches = contentWords.filter((word) =>
        questionWords.has(word),
      ).length;

      return {
        chunk,
        score: titleMatches * 3 + contentMatches,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((item) => item.chunk);
}
