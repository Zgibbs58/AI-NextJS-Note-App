import Image from "next/image";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function Home() {
  // Get the user ID from the session
  const { userId } = auth();
  // If the user is signed in, redirect to the notes page
  if (userId) redirect("/notes");

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-4">
        <Image src={logo} alt="Logo" width={100} height={100} />
        <span className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          FlowBrain
        </span>
      </div>
      <p className="max-w-prose text-center">
        An intelligent note-taking app that helps you organize your thoughts.
        Built with Next.js, Tailwind CSS, Pinecone, Shadcn UI, and Clerk.
      </p>
      <Button size="lg" asChild>
        <Link href="/notes">Open</Link>
      </Button>
    </main>
  );
}
