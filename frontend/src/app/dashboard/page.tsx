"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStoredToken, useStoredUser } from "@/lib/auth";
import {
    Activity, TrendingUp, Building2, BarChart3, Compass, Info, Lightbulb,
    AlertCircle, Award, BookOpen, Star, Trophy, Target, ArrowRight, Zap
} from "lucide-react";
import { analyticsApi, healthcareApi, agricultureApi, urbanApi, skillsApi } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

type Sector = "HEALTHCARE" | "AGRICULTURE" | "URBAN";

interface DashboardData {
    recentActivity: any[];
    skillGaps: any[];
    stats: {
        totalSkills: number;
        completedProjects: number;
        certifications: number;
        avgReadiness: number;
    }
}

export default function DashboardPage() {
    const router = useRouter();
    const user = useStoredUser();
    const token = useStoredToken();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardData>({
        recentActivity: [],
        skillGaps: [],
        stats: { totalSkills: 0, completedProjects: 0, certifications: 0, avgReadiness: 0 }
    });

    const typingChars = Math.min(40, Math.max(18, (user?.name?.length || 6) + 8));

    const typewriterStyle: React.CSSProperties & Record<string, string | number> = {
        "--typing-chars": typingChars,
        "--typing-duration": "3.4s",
    };

    useEffect(() => {
        if (!token || !user) {
            router.replace("/login");
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch basic stats and cross-sector analytics
                const crossSectorRes = await analyticsApi.getCrossSector().catch(() => ({ data: { overall: {} } }));
                const stats = crossSectorRes.data?.overall || {};

                // Fetch data for all sectors to aggregate
                const sectors: Sector[] = ["HEALTHCARE", "AGRICULTURE", "URBAN"];
                const apis = {
                    HEALTHCARE: healthcareApi,
                    AGRICULTURE: agricultureApi,
                    URBAN: urbanApi
                };

                const [
                    hcSkills, hcCerts, hcProjects, hcAnalytics,
                    agSkills, agCerts, agProjects, agAnalytics,
                    urSkills, urCerts, urProjects, urAnalytics
                ] = await Promise.all([
                    healthcareApi.getSkills().catch(() => ({ data: [] })),
                    healthcareApi.getCertifications().catch(() => ({ data: [] })),
                    healthcareApi.getProjects().catch(() => ({ data: [] })),
                    analyticsApi.get("HEALTHCARE").catch(() => ({ data: null })),

                    agricultureApi.getSkills().catch(() => ({ data: [] })),
                    agricultureApi.getCertifications().catch(() => ({ data: [] })),
                    agricultureApi.getProjects().catch(() => ({ data: [] })),
                    analyticsApi.get("AGRICULTURE").catch(() => ({ data: null })),

                    urbanApi.getSkills().catch(() => ({ data: [] })),
                    urbanApi.getCertifications().catch(() => ({ data: [] })),
                    urbanApi.getProjects().catch(() => ({ data: [] })),
                    analyticsApi.get("URBAN").catch(() => ({ data: null })),
                ]);

                // Process Recent Activity
                const activities = [
                    ...(hcCerts.data || []).map((i: any) => ({ ...i, type: 'certification', sector: 'HEALTHCARE', date: i.issueDate })),
                    ...(agCerts.data || []).map((i: any) => ({ ...i, type: 'certification', sector: 'AGRICULTURE', date: i.issueDate })),
                    ...(urCerts.data || []).map((i: any) => ({ ...i, type: 'certification', sector: 'URBAN', date: i.issueDate })),

                    ...(hcProjects.data || []).map((i: any) => ({ ...i, type: 'project', sector: 'HEALTHCARE', date: i.createdAt })),
                    ...(agProjects.data || []).map((i: any) => ({ ...i, type: 'project', sector: 'AGRICULTURE', date: i.createdAt })),
                    ...(urProjects.data || []).map((i: any) => ({ ...i, type: 'project', sector: 'URBAN', date: i.createdAt })),
                ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

                // Process Skill Gaps
                let gaps: any[] = [];
                const processGaps = (analytics: any, sector: string) => {
                    if (analytics?.data?.skillGaps) {
                        try {
                            const parsed = JSON.parse(analytics.data.skillGaps);
                            return parsed.map((g: any) => ({
                                ...g,
                                sector,
                                skillName: g.category ? g.category.replace(/_/g, ' ') : "Skill Gap",
                                currentScore: Math.floor(Math.random() * 30) + 10, // Mock current for demo (10-40%)
                                targetScore: 75 // Mock target
                            }));
                        } catch (e) { return []; }
                    }
                    return [];
                };

                gaps = [
                    ...processGaps(hcAnalytics, "HEALTHCARE"),
                    ...processGaps(agAnalytics, "AGRICULTURE"),
                    ...processGaps(urAnalytics, "URBAN")
                ].slice(0, 3);

                setData({
                    recentActivity: activities,
                    skillGaps: gaps,
                    stats: {
                        totalSkills: stats.totalSkills || 0,
                        completedProjects: stats.totalProjects || 0,
                        certifications: stats.totalCertifications || 0,
                        avgReadiness: stats.averageReadiness || 0
                    }
                });

            } catch (error) {
                console.error("Dashboard data fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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

            {/* Purpose & Instructions Section */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Purpose Card */}
                <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>

                    <div className="relative">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Compass className="h-6 w-6" />
                            Why are you here?
                        </h2>
                        <p className="text-blue-100 text-lg leading-relaxed mb-6">
                            SkillXIntell is your personal command center for academic and professional growth.
                            We simply help you <span className="font-semibold text-white">track, analyze, and improve</span> your readiness
                            in emerging sectors like Healthcare, Agriculture, and Smart Cities.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                                <h3 className="font-semibold mb-1 flex items-center gap-2">
                                    <Activity className="h-4 w-4" />
                                    Skill Tracking
                                </h3>
                                <p className="text-sm text-blue-100 opacity-90">Monitor your proficiency levels across tailored industry standards.</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                                <h3 className="font-semibold mb-1 flex items-center gap-2">
                                    <Lightbulb className="h-4 w-4" />
                                    AI Guidance
                                </h3>
                                <p className="text-sm text-blue-100 opacity-90">Get personalized career path recommendations and gap analysis.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Start Guide */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Info className="h-5 w-5 text-blue-600" />
                        Quick Start Guide
                    </h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
                            <div>
                                <h4 className="font-semibold text-slate-900">Choose a Sector</h4>
                                <p className="text-sm text-slate-600">Select a domain below (e.g., Healthcare) to view specific skills.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">2</div>
                            <div>
                                <h4 className="font-semibold text-slate-900">Take Assessment</h4>
                                <p className="text-sm text-slate-600">Complete quick quizzes to verify your current knowledge.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">3</div>
                            <div>
                                <h4 className="font-semibold text-slate-900">View Insights</h4>
                                <p className="text-sm text-slate-600">Check the Analytics tab to see your growth and recommendations.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skill Gap Analysis & Recent Activity Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Skill Gap Analysis */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/80 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-orange-500" />
                        Skill Gap Analysis
                    </h2>

                    <div className="space-y-6">
                        {data.skillGaps.length > 0 ? (
                            data.skillGaps.map((gap: any, i) => (
                                <div key={i} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-semibold text-slate-900">{gap.skillName || "Unknown Skill"}</h4>
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 mt-1 inline-block">
                                                {gap.sector === "HEALTHCARE" ? "Healthcare Tech" : gap.sector === "AGRICULTURE" ? "AgriTech" : "Smart Cities"}
                                            </span>
                                        </div>
                                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                                            <AlertCircle className="h-4 w-4" />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-500">Current: {gap.currentScore || 0}%</span>
                                            <span className="text-slate-500">Target: {gap.targetScore || 100}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                                                style={{ width: `${gap.currentScore || 0}%` }}
                                            />
                                        </div>
                                        <div className="text-right mt-1">
                                            <span className="text-xs font-bold text-orange-600">
                                                +{Math.max(0, (gap.targetScore || 100) - (gap.currentScore || 0))}% needed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p>No skill gaps identified yet. Great job!</p>
                                <button onClick={() => router.push('/dashboard/analytics')} className="text-sm text-blue-600 font-semibold mt-2 hover:underline">
                                    View Full Analytics
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/80 shadow-sm h-full">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Activity className="h-6 w-6 text-blue-500" />
                        Recent Activity
                    </h2>

                    <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                        {data.recentActivity.length > 0 ? (
                            data.recentActivity.map((item, i) => (
                                <div key={i} className="relative pl-10">
                                    <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10 ${item.type === 'certification' ? 'bg-orange-100 text-orange-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                        {item.type === 'certification' ? <Award className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 leading-tight">
                                            {item.type === 'certification' ? `Earned ${item.name}` : `Submitted ${item.title}`}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-slate-500">{item.sector}</span>
                                            <span className="text-slate-300">•</span>
                                            <span className="text-xs text-slate-400">
                                                {item.date ? formatDistanceToNow(new Date(item.date), { addSuffix: true }) : 'Recently'}
                                            </span>
                                        </div>
                                        {item.type === 'certification' && (
                                            <div className="mt-2 text-xs font-medium text-green-600 bg-green-50 inline-block px-2 py-1 rounded">
                                                Verified & Certified
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 pl-4 text-slate-500">
                                <p>No recent activity.</p>
                                <p className="text-sm text-slate-400 mt-1">Complete courses or add projects to see them here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
                </div>
            </div>
        </div>
    );
}
