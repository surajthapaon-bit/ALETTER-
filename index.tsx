import { createFileRoute } from "@tanstack/react-router";
import { LetterExperience } from "@/letter/experience";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main>
      <h1 className="sr-only">A Letter</h1>
      <LetterExperience />
    </main>
  );
}
