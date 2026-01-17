import Link from "next/link";

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <header className="border-b p-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/dashboard" className="font-semibold">
            Dashboard
          </Link>
          <nav className="flex gap-3 text-sm opacity-80">
            <Link href="/dashboard/analytics">Analytics</Link>
            <Link href="/dashboard/skills">Skills</Link>
            <Link href="/dashboard/profile">Profile</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-6">{children}</main>
    </div>
  );
}
