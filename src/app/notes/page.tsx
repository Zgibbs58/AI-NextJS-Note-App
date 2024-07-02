import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import prisma from "@/lib/db/prisma";
import Note from "@/components/Notes";

export const metadata: Metadata = {
  title: "Notes",
  description: "All your notes in one place",
};

export default async function NotesPage() {
  const { userId } = auth();

  if (!userId) throw Error("userId undefined");

  const allNotes = await prisma.note.findMany({ where: { userId } });
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {allNotes.length === 0 ? (
        <div className="col-span-full text-center">
          {"You don't have any notes yet. Why don't you create one?"}
        </div>
      ) : (
        allNotes.map((note) => <Note note={note} key={note.id} />)
      )}
    </div>
  );
}
