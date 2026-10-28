import type { Shipment } from "@/lib/shipments";
import { getDelayedShipments, getShipmentById } from "@/lib/shipment-tools";
import { retrieveKnowledge } from "@/lib/knowledge-base";
import { generateRagAnswer } from "@/lib/llm";
export type AgentUI =
  | { type: "shipment_table"; shipments: Shipment[] }
  | { type: "shipment_detail"; shipment: Shipment }
  | { type: "text" };

export type AgentResult = {
  answer: string;
  toolUsed: string | null;
  mode: "mock";
  ui: AgentUI;
};

export async function runMockAgent(message: string): Promise<AgentResult> {
  const shipmentMatch = message.match(/\bSHP-\d+\b/i);

  if (shipmentMatch) {
    const shipment = await getShipmentById(shipmentMatch[0]);

    if (!shipment) {
      return {
        answer: `I couldn't find ${shipmentMatch[0]} in the sample shipment data.`,
        toolUsed: "getShipmentById",
        mode: "mock",
        ui: { type: "text" },
      };
    }

    return {
      answer: `Here are the details for ${shipment.id}.`,
      toolUsed: "getShipmentById",
      mode: "mock",
      ui: { type: "shipment_detail", shipment },
    };
  }

  const question = message.toLowerCase();

  const asksAboutDelays =
    question.includes("delayed shipment") ||
    question.includes("delayed shipments") ||
    question.includes("shipments are delayed") ||
    question.includes("shipment delays");

  if (asksAboutDelays) {
    const delayed = await getDelayedShipments();

    return {
      answer:
        delayed.length === 0
          ? "There are no delayed shipments in the database."
          : `I found ${delayed.length} delayed shipments.`,
      toolUsed: "getDelayedShipments",
      mode: "mock",
      ui: { type: "shipment_table", shipments: delayed },
    };
  }

  const knowledge = retrieveKnowledge(message);

  if (knowledge.length > 0) {
    const answer = await generateRagAnswer(message, knowledge);
    // const answer = knowledge
    //   .map((chunk) => `**${chunk.title}**\n${chunk.content}`)
    //   .join("\n\n");

    const sources = knowledge
      .map((chunk) => `${chunk.id}: ${chunk.title}`)
      .join(", ");

    return {
      answer: `${answer}\n\nSources: ${sources}`,
      toolUsed: "retrieveKnowledge",
      mode: "mock",
      ui: { type: "text" },
    };
  }

  return {
    answer:
      'Try asking "Which shipments are delayed?", "Show me shipment SHP-1003", or "What should I do when a shipment is delayed?"',
    toolUsed: null,
    mode: "mock",
    ui: { type: "text" },
  };
}
