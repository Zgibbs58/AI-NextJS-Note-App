import { notesIndex } from "@/lib/db/pinecone";
import openai, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import prisma from "@/lib/db/prisma";
import { OpenAIStream, StreamingTextResponse } from "ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // extracts the messages array from the request body, with each message adhering to the ChatCompletionMessage type structure.
    const messages: ChatCompletionMessage[] = body.messages;

    // retrieves the last 6 messages from the chat history, which will be used to generate the chat response.
    // This saves the model from having to process the entire chat history, which saves token usage and processing time.
    const messagesTruncated = messages.slice(-6);

    // generates the chat response by concatenating the content of the last 6 messages and passing it to the getEmbedding function.
    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n"),
    );
    //This is what we turn into a vector embedding
    // Hey, what's my wifi password?
    // It's "password123".
    // Thanks! What is my phone pin?

    const { userId } = auth();

    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      // topK is set how many notes you want to return.
      // if you make this 3, it will return the top 3 most similar notes.
      // The higher the number, the more notes you will get back and more processing time/token usage it will take.
      topK: 4,
      filter: { userId },
    });

    const relevantNotes = await prisma.note.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
    });

    console.log("Relevant notes found:", relevantNotes);

    const systemMessage: ChatCompletionMessage = {
      role: "system",
      content:
        "You are an intelligent note-taking app. You answer the user's question based on their existing notes. " +
        "The relevan notes for this query are:\n" +
        relevantNotes
          .map((note) => `Title: ${note.title}\n\nContent:\n${note.content}`)
          .join("\n\n"),
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
