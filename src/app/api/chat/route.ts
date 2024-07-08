import { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { ChatCompletionMessage } from "openai/resources/index.mjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // extracts the messages array from the request body, with each message adhering to the ChatCompletionMessage type structure.
    const messages: ChatCompletionMessage[] = body.messages;

    // retrieves the last 6 messages from the chat history, which will be used to generate the chat response.
    // This saves the model from having to process the entire chat history, which saves token usage and processing time.
    const messagesTruncated = messages.slice(-6);

    // generates the chat response by concatenating the content of the last 6 messages and passing it to the getEmbedding function.
    const embeddings = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n"),
    );
    //This is what we turn into a vector embedding
    // Hey, what's my wifi password?
    // It's "password123".
    // Thanks! What is my phone pin?

    const { userId } = auth();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
