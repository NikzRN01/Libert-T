"use client";

import { useEffect, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { useStoredToken, useStoredUser } from "@/lib/auth";
import { Activity, TrendingUp, Building2, BarChart3 } from "lucide-react";

export default function DashboardPage() {
    const router = useRouter();
    const user = useStoredUser();
    const token = useStoredToken();
    const typingChars = Math.min(40, Math.max(18, (user?.name?.length || 6) + 8));

    const typewriterStyle: CSSProperties & Record<string, string | number> = {
        "--typing-chars": typingChars,
        "--typing-duration": "3.4s",
    };

    useEffect(() => {
        if (!token || !user) {
            router.replace("/login");
        }
    }, [router, token, user]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="relative rounded-2xl p-8 md:p-10 overflow-hidden shadow-2xl bg-white/80 border border-slate-200/80 backdrop-blur-xl">
                <div className="absolute inset-0 pointer-events-none" aria-hidden>
                    <div
                        className="absolute inset-0 opacity-70"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.12), transparent 38%), radial-gradient(circle at 80% 10%, rgba(168,85,247,0.12), transparent 35%), radial-gradient(circle at 50% 100%, rgba(14,165,233,0.14), transparent 40%)",
                        }}
                    ></div>
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage:
                                "linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(180deg, rgba(15,23,42,0.05) 1px, transparent 1px)",
                            backgroundSize: "24px 24px",
                        }}
                    ></div>
                </div>
                <div className="relative">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-1 drop-shadow-sm">
                        <span
                            className="typewriter"
                            style={typewriterStyle}
                        >
                            Hi, {user.name}!!!
                        </span>
                    </h1>
                </div>
            </div>

            <style jsx>{`
                .typewriter {
                    display: inline-block;
                    font-family: "SFMono-Regular", ui-monospace, "Roboto Mono", monospace;
                    overflow: hidden;
                    white-space: nowrap;
                    border-right: 3px solid #0f172a;
                    animation:
                        typing var(--typing-duration, 3.6s) steps(var(--typing-chars, 20)) forwards,
                        caret 0.9s step-end 2 var(--typing-duration, 3.6s) forwards;
                }
                @keyframes typing {
                    from { width: 0; }
                    to { width: calc(var(--typing-chars, 20) * 1ch); }
                }
                @keyframes caret {
                    0% { border-color: #0f172a; }
                    50% { border-color: transparent; }
                    100% { border-color: transparent; }
                }
            `}</style>

            {/* Dashboard Navigation Grid */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Explore Your Sectors</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Healthcare */}
                    <button
                        onClick={() => router.push('/dashboard/healthcare')}
                        className="group relative bg-white/85 rounded-2xl p-8 border border-blue-100 hover:border-blue-300 hover:shadow-[0_25px_60px_-25px_rgba(59,130,246,0.55)] transition-all duration-300 text-left hover:-translate-y-1 backdrop-blur-lg"
                    >
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform bg-blue-600 text-white">
                                <Activity className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">Healthcare</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                Patient care, health systems, and clinical workflows.
                            </p>
                            <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                                <span>Open dashboard</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </div>
                    </button>

                    {/* Agriculture */}
                    <button
                        onClick={() => router.push('/dashboard/agriculture')}
                        className="group relative bg-white/85 rounded-2xl p-8 border border-green-100 hover:border-green-300 hover:shadow-[0_25px_60px_-25px_rgba(34,197,94,0.55)] transition-all duration-300 text-left hover:-translate-y-1 backdrop-blur-lg"
                    >
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform bg-green-600 text-white">
                                <TrendingUp className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">Agriculture</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                Precision farming telemetry, IoT field health, and yield forecasts.
                            </p>
                            <div className="flex items-center text-green-600 font-semibold text-sm group-hover:gap-2 transition-all">
                                <span>Open dashboard</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </div>
                    </button>

                    {/* Urban */}
                    <button
                        onClick={() => router.push('/dashboard/urban')}
                        className="group relative bg-white/85 rounded-2xl p-8 border border-cyan-100 hover:border-cyan-300 hover:shadow-[0_25px_60px_-25px_rgba(6,182,212,0.55)] transition-all duration-300 text-left hover:-translate-y-1 backdrop-blur-lg"
                    >
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform bg-cyan-600 text-white">
                                <Building2 className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">Urban & Smart Cities</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                Mobility, City life, smart infrastructure, and readiness scores.
                            </p>
                            <div className="flex items-center text-cyan-700 font-semibold text-sm group-hover:gap-2 transition-all">
                                <span>Open dashboard</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </div>
                    </button>

                    {/* Analytics */}
                    <button
                        onClick={() => router.push('/dashboard/analytics')}
                        className="group relative bg-white/85 rounded-2xl p-8 border border-orange-100 hover:border-orange-300 hover:shadow-[0_25px_60px_-25px_rgba(249,115,22,0.55)] transition-all duration-300 text-left hover:-translate-y-1 backdrop-blur-lg"
                    >
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform bg-orange-600 text-white">
                                <BarChart3 className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">Analytics</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                Skill gaps, readiness scores, and AI-driven recommendations.
                            </p>
                            <div className="flex items-center text-orange-600 font-semibold text-sm group-hover:gap-2 transition-all">
                                <span>Open dashboard</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
