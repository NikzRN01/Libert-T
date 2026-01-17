"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStoredToken, useStoredUser } from "@/lib/auth";
import { Activity, TrendingUp, Building2, BarChart3, Sparkles } from "lucide-react";

export default function DashboardPage() {
    const router = useRouter();
    const user = useStoredUser();
    const token = useStoredToken();

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
            <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 md:p-10 overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-grid-white/10"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                        <Sparkles className="h-6 w-6 text-yellow-300" />
                        <span className="text-blue-100 font-semibold">Welcome back!</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        Hi, {user.name}! 👋
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl">
                        Continue your journey to master skills in Healthcare, Agriculture, and Urban Technology
                    </p>
                </div>
            </div>

            {/* Dashboard Navigation Grid */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Explore Your Sectors</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Healthcare */}
                    <button
                        onClick={() => router.push('/dashboard/healthcare')}
                        className="group relative bg-white rounded-2xl p-8 border-2 border-blue-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 text-left hover:-translate-y-1"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full opacity-50"></div>
                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
                                <Activity className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Healthcare</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                Medical coding, EHR systems, and clinical informatics
                            </p>
                            <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                                <span>View Dashboard</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </div>
                    </button>

                    {/* Agriculture */}
                    <button
                        onClick={() => router.push('/dashboard/agriculture')}
                        className="group relative bg-white rounded-2xl p-8 border-2 border-green-100 hover:border-green-300 hover:shadow-2xl transition-all duration-300 text-left hover:-translate-y-1"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full opacity-50"></div>
                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
                                <TrendingUp className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Agriculture</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                Precision farming, IoT sensors, and agritech projects
                            </p>
                            <div className="flex items-center text-green-600 font-semibold text-sm group-hover:gap-2 transition-all">
                                <span>View Dashboard</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </div>
                    </button>

                    {/* Urban */}
                    <button
                        onClick={() => router.push('/dashboard/urban')}
                        className="group relative bg-white rounded-2xl p-8 border-2 border-purple-100 hover:border-purple-300 hover:shadow-2xl transition-all duration-300 text-left hover:-translate-y-1"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full opacity-50"></div>
                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
                                <Building2 className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Urban & Smart Cities</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                GIS, smart infrastructure, and urban planning
                            </p>
                            <div className="flex items-center text-purple-600 font-semibold text-sm group-hover:gap-2 transition-all">
                                <span>View Dashboard</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </div>
                    </button>

                    {/* Analytics */}
                    <button
                        onClick={() => router.push('/dashboard/analytics')}
                        className="group relative bg-white rounded-2xl p-8 border-2 border-orange-100 hover:border-orange-300 hover:shadow-2xl transition-all duration-300 text-left hover:-translate-y-1"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full opacity-50"></div>
                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
                                <BarChart3 className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Analytics</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                Skill gap analysis, career readiness, and AI insights
                            </p>
                            <div className="flex items-center text-orange-600 font-semibold text-sm group-hover:gap-2 transition-all">
                                <span>View Dashboard</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
