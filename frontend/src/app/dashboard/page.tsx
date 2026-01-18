"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { useStoredToken, useStoredUser } from "@/lib/auth";
import { Activity, TrendingUp, Building2, BarChart3, Zap, AlertTriangle } from "lucide-react";
import { healthcareApi, agricultureApi, urbanApi } from "@/lib/api";

type Sector = "HEALTHCARE" | "AGRICULTURE" | "URBAN";

type SkillItem = {
    id: string;
    name: string;
    level?: number;
    proficiency?: number;
    proficiencyLevel?: number;
    category?: string;
};

type SkillsResponse = {
    skills?: SkillItem[];
    data?: SkillItem[];
} | SkillItem[];

type SkillGapItem = {
    skill: string;
    sector: string;
    sectorKey: Sector;
    current: number;
    required: number;
    skillCount: number;
};

function clampPercent(value: number): number {
    if (Number.isNaN(value)) return 0;
    return Math.max(0, Math.min(100, Math.round(value)));
}

function extractSkills(response: unknown): SkillItem[] {
    if (Array.isArray(response)) return response;
    if (response && typeof response === "object") {
        const resp = response as SkillsResponse;
        if ("skills" in resp && Array.isArray(resp.skills)) return resp.skills;
        if ("data" in resp && Array.isArray(resp.data)) return resp.data;
    }
    return [];
}

function calculateAverageLevel(skills: SkillItem[]): number {
    if (skills.length === 0) return 0;
    const total = skills.reduce((sum, skill) => {
        // proficiencyLevel is typically 1-5, convert to percentage
        const profLevel = skill.proficiencyLevel ?? skill.level ?? skill.proficiency;
        if (typeof profLevel === "number") {
            // If it's 1-5 scale, convert to percentage
            if (profLevel <= 5) {
                return sum + (profLevel * 20);
            }
            // Already a percentage
            return sum + profLevel;
        }
        return sum;
    }, 0);
    return clampPercent(total / skills.length);
}

export default function DashboardPage() {
    const router = useRouter();
    const user = useStoredUser();
    const token = useStoredToken();
    const typingChars = Math.min(40, Math.max(18, (user?.name?.length || 6) + 8));

    const [skillGapData, setSkillGapData] = useState<SkillGapItem[]>([]);
    const [loadingGaps, setLoadingGaps] = useState(true);
    const hasFetched = useRef(false);

    const typewriterStyle: CSSProperties & Record<string, string | number> = {
        "--typing-chars": typingChars,
        "--typing-duration": "3.4s",
    };

    useEffect(() => {
        if (!token || !user) {
            router.replace("/login");
        }
    }, [router, token, user]);

    // Fetch skill data from all sectors
    useEffect(() => {
        if (!token || !user || hasFetched.current) return;
        hasFetched.current = true;

        const fetchSectorSkills = async () => {
            setLoadingGaps(true);
            try {
                const [healthcareRes, agricultureRes, urbanRes] = await Promise.allSettled([
                    healthcareApi.getSkills(),
                    agricultureApi.getSkills(),
                    urbanApi.getSkills(),
                ]);

                const healthcareSkills = healthcareRes.status === "fulfilled" ? extractSkills(healthcareRes.value) : [];
                const agricultureSkills = agricultureRes.status === "fulfilled" ? extractSkills(agricultureRes.value) : [];
                const urbanSkills = urbanRes.status === "fulfilled" ? extractSkills(urbanRes.value) : [];

                const healthcareLevel = calculateAverageLevel(healthcareSkills);
                const agricultureLevel = calculateAverageLevel(agricultureSkills);
                const urbanLevel = calculateAverageLevel(urbanSkills);

                const gaps: SkillGapItem[] = [];

                // Only add sectors that have skills
                if (healthcareSkills.length > 0) {
                    gaps.push({
                        skill: "Healthcare Informatics",
                        sector: "Healthcare Tech",
                        sectorKey: "HEALTHCARE",
                        current: healthcareLevel,
                        required: 70,
                        skillCount: healthcareSkills.length,
                    });
                }

                if (agricultureSkills.length > 0) {
                    gaps.push({
                        skill: "Agricultural Data Systems",
                        sector: "AgriTech",
                        sectorKey: "AGRICULTURE",
                        current: agricultureLevel,
                        required: 65,
                        skillCount: agricultureSkills.length,
                    });
                }

                if (urbanSkills.length > 0) {
                    gaps.push({
                        skill: "Urban Planning Analytics",
                        sector: "Smart Cities",
                        sectorKey: "URBAN",
                        current: urbanLevel,
                        required: 75,
                        skillCount: urbanSkills.length,
                    });
                }

                setSkillGapData(gaps);
            } catch (error) {
                console.error("Failed to fetch sector skills:", error);
                // Keep empty state on error
                setSkillGapData([]);
            } finally {
                setLoadingGaps(false);
            }
        };

        void fetchSectorSkills();
    }, [token, user]);

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

            {/* Skill Gap Analysis Section */}
            <div className="bg-white/85 rounded-2xl p-6 border border-slate-200/80 shadow-lg backdrop-blur-lg">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                        Skill Gap Analysis
                    </h2>
                    {loadingGaps && (
                        <div className="text-sm text-slate-500">Loading...</div>
                    )}
                </div>

                <div className="space-y-4">
                    {!loadingGaps && skillGapData.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            <p className="text-sm">No skills found in any sector.</p>
                            <p className="text-xs mt-1">Add skills to Healthcare, Agriculture, or Urban sectors to see your skill gap analysis.</p>
                        </div>
                    ) : (
                        skillGapData.map((item, idx) => {
                            const gap = item.required - item.current;
                            const isHighGap = gap >= 30;
                            const progressPercent = Math.min((item.current / item.required) * 100, 100);

                            return (
                                <div
                                    key={idx}
                                    className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-base font-semibold text-slate-900">
                                                {item.skill}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="inline-block px-2.5 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 font-medium">
                                                    {item.sector}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {item.skillCount} skill{item.skillCount !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`shrink-0 p-2.5 rounded-full ${isHighGap ? 'bg-orange-50' : 'bg-amber-50'}`}>
                                            {isHighGap ? (
                                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                                            ) : (
                                                <TrendingUp className="w-5 h-5 text-amber-500" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between text-sm mb-2">
                                                <span className="text-slate-600">
                                                    Current: <span className="font-semibold text-slate-900">{item.current}%</span>
                                                </span>
                                                <span className="text-slate-400">→</span>
                                                <span className="text-slate-600">
                                                    Required: <span className="font-semibold text-slate-900">{item.required}%</span>
                                                </span>
                                            </div>
                                            <div className="relative h-2.5 rounded-full bg-slate-100 overflow-hidden">
                                                <div
                                                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-500"
                                                    style={{ width: `${progressPercent}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className={`text-right min-w-[60px] ${isHighGap ? 'text-orange-500' : 'text-amber-500'}`}>
                                            <div className="text-lg font-bold">+{gap}%</div>
                                            <div className="text-xs font-medium">needed</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
