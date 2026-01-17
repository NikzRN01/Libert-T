import Link from "next/link";
import { Brain } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 relative overflow-hidden">
            {/* Decorative background elements matching landing page */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-[550px] space-y-8 relative z-10">
                {/* Logo & Header */}
                <Link href="/" className="flex flex-col items-center gap-4 text-center group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
                        <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">
                            <Brain className="h-7 w-7 text-white" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-1">
                            SkillXIntell
                        </h1>
                        <p className="text-sm text-slate-600">
                            AI-Powered Skill Intelligence
                        </p>
                    </div>
                </Link>

                {/* Main Content Card */}
                <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-xl p-8 sm:p-10">
                    {children}
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-slate-500">
                    &copy; 2026 SkillXIntell. All rights reserved.
                </div>
            </div>
        </div>
    );
}
