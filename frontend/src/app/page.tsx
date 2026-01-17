import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">SkillXIntell</h1>
          <ThemeToggle />
        </header>

        <p className="text-sm opacity-80">
          Monorepo scaffold: Next.js frontend + Express backend.
        </p>

        <Link
          className="inline-flex rounded-md border px-4 py-2 text-sm"
          href="/dashboard"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
