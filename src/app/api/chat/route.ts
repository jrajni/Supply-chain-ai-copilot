import { NextResponse } from "next/server";
import { runMockAgent } from "@/lib/mock-agent";

export async function POST(request: Request) {
  // console.log("POST");
  try {
    const body: unknown = await request.json();
    console.log("BODY", body);
    if (
      typeof body !== "object" ||
      body === null ||
      !("message" in body) ||
      typeof body.message !== "string"
    ) {
      return NextResponse.json(
        { error: "Please provide a valid message." },
        { status: 400 },
      );
    }
    const message = body.message.trim();
    if (!message || message.length > 2000) {
      return NextResponse.json(
        { error: "Message must contain 1–2000 characters." },
        { status: 400 },
      );
    }
    const result = await runMockAgent(message);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Invalid request or unexpected server error." },
      { status: 400 },
    );
  }
}
