// Import the schema for creating a note from the validation library
import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validation/note";
// Import the authentication module from Clerk for Next.js server-side
import { auth } from "@clerk/nextjs/server";
// Import the Prisma client instance for database operations
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import { notesIndex } from "@/lib/db/pinecone";

// Create a new note with the specified title and content
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

    const embedding = await getEmbeddingForNote(title, content);

    // Create a transaction to create the note and update the Pinecone index
    // with the note's embedding and metadata (userId)
    const note = await prisma.$transaction(async (tx) => {
      const note = await tx.note.create({
        data: {
          title,
          content,
          userId,
        },
      });

      await notesIndex.upsert([
        {
          id: note.id,
          values: embedding,
          metadata: { userId },
        },
      ]);

      return note;
    });
    console.log("Note created successfully:", note);
    // Return the created note with a 201 Created status
    return Response.json({ note }, { status: 201 });
  } catch (error) {
    console.error("Internal server error:", error);
    // If an error occurs, return a 500 Internal Server Error response
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Update a note with the specified id
export async function PUT(req: Request) {
  try {
    // Parse the JSON body of the request
    const body = await req.json();

    // Validate the request body against the updateNoteSchema
    const parseResult = updateNoteSchema.safeParse(body);

    // If the validation fails, log the error and return a 400 response
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    // Destructure id, title, and content from the validated data
    const { id, title, content } = parseResult.data;

    // Find the note with the specified id
    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    // Retrieve the userId from the authentication context
    const { userId } = auth();

    // If no userId is found or the userid does not match the note's userid return a 401 Unauthorized response
    if (!userId || userId !== note.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const embedding = await getEmbeddingForNote(title, content);

    const updatedNote = await prisma.$transaction(async (tx) => {
      const updatedNote = await tx.note.update({
        where: { id },
        data: {
          title,
          content,
        },
      });

      await notesIndex.upsert([
        {
          id,
          values: embedding,
          metadata: { userId },
        },
      ]);

      return updatedNote;
    });

    return Response.json(updatedNote, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Delete a note with the specified id
export async function DELETE(req: Request) {
  try {
    // Parse the JSON body of the request
    const body = await req.json();

    // Validate the request body against the updateNoteSchema
    const parseResult = deleteNoteSchema.safeParse(body);

    // If the validation fails, log the error and return a 400 response
    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    // Destructure id, title, and content from the validated data
    const { id } = parseResult.data;

    // Find the note with the specified id
    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    // Retrieve the userId from the authentication context
    const { userId } = auth();

    // If no userId is found or the userid does not match the note's userid return a 401 Unauthorized response
    if (!userId || userId !== note.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.note.delete({
        where: { id },
      });
      await notesIndex.deleteOne(id);
    });

    return Response.json({ message: "Note Deleted" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function getEmbeddingForNote(title: string, content: string | undefined) {
  return getEmbedding(title + "\n\n" + (content || ""));
}
