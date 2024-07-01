import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import prisma from "@/lib/db/prisma";

export const metadata: Metadata = {
  title: "Notes",
  description: "All your notes in one place",
};

export default async function NotesPage() {
  const { userId } = auth();

  if (!userId) throw Error("userId undefined");

  const allNotes = await prisma.note.findMany({ where: { userId } });
  return (
    <div>{allNotes.length === 0 ? "No Notes" : JSON.stringify(allNotes)}</div>
  );
}
