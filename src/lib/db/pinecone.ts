import { Pinecone } from "@pinecone-database/pinecone";

const apiKeyVar = process.env.PINECONE_API_KEY;

if (!apiKeyVar) {
  throw new Error("PINECONE_API_KEY is not set");
}

const pc = new Pinecone({
  apiKey: apiKeyVar,
});

export const notesIndex = pc.Index("ai-nextjs-note-app");
