// Import the schema for creating a note from the validation library
import { createNoteSchema } from "@/lib/validation/note";
// Import the authentication module from Clerk for Next.js server-side
import { auth } from "@clerk/nextjs/server";
// Import the Prisma client instance for database operations
import prisma from "@/lib/db/prisma";

// Define an asynchronous function named POST to handle POST requests
export async function POST(req: Request) {
  try {
    // Parse the JSON body of the request
    const body = await req.json();

    // Validate the request body against the createNoteSchema
    const parseResult = createNoteSchema.safeParse(body);

    // If the validation fails, log the error and return a 400 response
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    // Destructure title and content from the validated data
    const { title, content } = parseResult.data;

    // Retrieve the userId from the authentication context
    const { userId } = auth();

    // If no userId is found, return a 401 Unauthorized response
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create a new note in the database with the title, content, and userId
    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId,
      },
    });

    // Return the created note with a 201 Created status
    return Response.json(note, { status: 201 });
  } catch (error) {
    // If an error occurs, return a 500 Internal Server Error response
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
