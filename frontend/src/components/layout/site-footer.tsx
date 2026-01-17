import Link from "next/link";
import { Brain } from "lucide-react";

export default function SiteFooter() {
    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
            <div className="container mx-auto px-4 py-8">
                {/* Brand */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3 justify-center">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                            <Brain className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">SkillXIntell</span>
                        <span className="hidden md:inline text-slate-700 mx-2">•</span>
                        <p className="hidden md:inline text-sm text-slate-400">
                            AI-powered skill intelligence platform for Healthcare, Agriculture, Urban Technology & Beyond professionals.
                        </p>
                    </div>
                    <p className="md:hidden text-sm text-slate-400 leading-relaxed text-center">
                        AI-powered skill intelligence platform for Healthcare, Agriculture, and Urban Technology professionals.
                    </p>
                </div>

                {/* Product Links - Horizontal */}
                <div className="flex flex-wrap items-center justify-center gap-6 mb-6 text-sm">
                    <a href="#features" className="hover:text-blue-400 transition-colors cursor-pointer">
                        Features
                    </a>
                    <span className="text-slate-700">•</span>
                    <a href="#sectors" className="hover:text-blue-400 transition-colors cursor-pointer">
                        Sectors
                    </a>
                    <span className="text-slate-700">•</span>
                    <a href="#how-it-works" className="hover:text-blue-400 transition-colors cursor-pointer">
                        How it Works
                    </a>
                    <span className="text-slate-700">•</span>
                    <Link href="/register" className="hover:text-blue-400 transition-colors">
                        Get Started
                    </Link>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-slate-800 text-center text-sm text-slate-400">
                    <p>© 2026 SkillXIntell. Built for better education and career outcomes. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
