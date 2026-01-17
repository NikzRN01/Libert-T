import Link from "next/link";
import { Brain } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-linear-to-br from-primary/5 via-background to-accent/5">
            <div className="w-full max-w-[400px] space-y-6">
                {/* Logo & Header */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <Link href="/" className="flex items-center gap-2 mb-2">
                        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                            <Brain className="h-8 w-8 text-white" />
                        </div>
                    </Link>
                    <span className="font-bold text-3xl tracking-tight bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SkillXIntell</span>
                    <p className="text-sm text-gray-600 font-semibold">
                        Academic & Professional Skill Intelligence
                    </p>
                </div>

                {/* Main Content Card */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-2xl p-6 sm:p-8 hover:shadow-3xl transition-shadow">
                    {children}
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-500 font-medium">
                    &copy; 2026 SkillXIntell. All rights reserved.
                </div>
            </div>
        </div>
    );
}
