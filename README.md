# Supply Chain AI Copilot

An AI-powered assistant for supply-chain operations that combines structured shipment data with retrieval-augmented generation (RAG) to answer operational questions.

**[🚀 Try the Live Demo](https://supply-chain-ai-copilot.vercel.app/)** · **[View Source Code](https://github.com/jrajni/Supply-chain-ai-copilot)**

Ask questions about delayed shipments, look up shipment details, and get answers grounded in operational data and relevant procedures.

## Features

- Shipment lookup using structured database queries
- Delayed-shipment identification
- RAG-based answers from a sample operations knowledge base
- AI-generated explanations for relevant operational questions
- Deployed Next.js application

## Tech Stack

Next.js · React · TypeScript · Prisma · PostgreSQL (Neon) · Groq · RAG · Vercel

## Architecture

User question → Intent routing / agent → Database tools or knowledge retrieval → LLM-generated response → UI

## Live Demo

https://supply-chain-ai-copilot.vercel.app/

> This project uses sample shipment data. Do not enter confidential business or customer information.
