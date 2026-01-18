"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { analyticsApi } from "@/lib/api";
import { SectorPerformanceChart } from "@/components/sector-performance-chart";
import Link from "next/link";
import {
    Activity,
    Award,
    BarChart3,
    Brain,
    Briefcase,
    Building2,
    MessageCircle,
    Newspaper,
    RefreshCw,
    Sparkles,
    Sprout,
    Target,
    TrendingUp,
} from "lucide-react";

type Sector = "HEALTHCARE" | "AGRICULTURE" | "URBAN";

type SkillAnalyticsRow = {
    id: string;
    sector: Sector;
    overallScore: number;
    careerReadiness: number;
    industryAlignment: number;
    calculatedAt?: string;
};

type CrossSectorResponse = {
    success: boolean;
    data: {
        bySector: Partial<Record<Sector, SkillAnalyticsRow | null>>;
        overall: {
            totalSkills: number;
            totalProjects: number;
            totalCertifications: number;
            averageReadiness: number;
            sectorsActive: number;
        };
    };
    message?: string;
};

type Recommendation = {
    type: "news" | "opportunity";
    title: string;
    description: string;
    source?: string;
    url?: string;
    date?: string;
};

function extractRecommendations(payload: unknown): Recommendation[] {
    const maybeRecs = (value: unknown): unknown => {
        if (!value || typeof value !== "object") return undefined;
        if ("recommendations" in value) return (value as { recommendations?: unknown }).recommendations;
        if ("data" in value) {
            const data = (value as { data?: unknown }).data;
            if (data && typeof data === "object" && "recommendations" in data) {
                return (data as { recommendations?: unknown }).recommendations;
            }
        }
        return undefined;
    };

    const recs = maybeRecs(payload);
    if (!Array.isArray(recs)) return [];

    return recs.filter((r): r is Recommendation => {
        if (!r || typeof r !== "object") return false;
        const obj = r as Partial<Recommendation>;
        return (
            (obj.type === "news" || obj.type === "opportunity") &&
            typeof obj.title === "string" &&
            typeof obj.description === "string"
        );
    });
}

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [data, setData] = useState<CrossSectorResponse["data"] | null>(null);
    const [generating, setGenerating] = useState(false);
    const [healthcareRecs, setHealthcareRecs] = useState<Recommendation[]>([]);
    const [agricultureRecs, setAgricultureRecs] = useState<Recommendation[]>([]);
    const [urbanRecs, setUrbanRecs] = useState<Recommendation[]>([]);
    const [loadingRecs, setLoadingRecs] = useState<Record<string, boolean>>({});

    const fetchOverview = useCallback(async () => {
        setLoading(true);
        setError("");
"use client";

import { useCallback, useEffect, useState } from "react";
import { BarChart3, TrendingUp, Target, Award, Brain, RefreshCw, Activity, Sprout, Building2, Newspaper, Briefcase, Sparkles, MessageCircle } from "lucide-react";
import Link from "next/link";
import { SectorPerformanceChart } from "@/components/sector-performance-chart";

interface SectorAnalytics {
    overallScore: number;
    careerReadiness: number;
    industryAlignment: number;
}

interface Recommendation {
    type: "news" | "opportunity";
    title: string;
    description: string;
    source?: string;
    url?: string;
    date?: string;
}

interface CrossSectorAnalytics {
    overall: {
        totalSkills: number;
        totalProjects: number;
        totalCertifications: number;
        averageReadiness: number;
        sectorsActive: number;
    };
    bySector: {
        HEALTHCARE?: SectorAnalytics;
        AGRICULTURE?: SectorAnalytics;
        URBAN?: SectorAnalytics;
    };
}

export default function AnalyticsDashboard() {
    const [analytics, setAnalytics] = useState<CrossSectorAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [healthcareRecs, setHealthcareRecs] = useState<Recommendation[]>([]);
    const [agricultureRecs, setAgricultureRecs] = useState<Recommendation[]>([]);
    const [urbanRecs, setUrbanRecs] = useState<Recommendation[]>([]);
    const [loadingRecs, setLoadingRecs] = useState<{ [key: string]: boolean }>({});

    const fetchAnalytics = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/analytics/cross-sector/overview`,
                { headers }
            );

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // Transform the data to match our interface
                    const bySector: CrossSectorAnalytics["bySector"] = {};

                    if (data.data.bySector.HEALTHCARE) {
                        bySector.HEALTHCARE = {
                            overallScore: data.data.bySector.HEALTHCARE.overallScore || 0,
                            careerReadiness: data.data.bySector.HEALTHCARE.careerReadiness || 0,
                            industryAlignment: data.data.bySector.HEALTHCARE.industryAlignment || 0,
                        };
                    }
                    if (data.data.bySector.AGRICULTURE) {
                        bySector.AGRICULTURE = {
                            overallScore: data.data.bySector.AGRICULTURE.overallScore || 0,
                            careerReadiness: data.data.bySector.AGRICULTURE.careerReadiness || 0,
                            industryAlignment: data.data.bySector.AGRICULTURE.industryAlignment || 0,
                        };
                    }
                    if (data.data.bySector.URBAN) {
                        bySector.URBAN = {
                            overallScore: data.data.bySector.URBAN.overallScore || 0,
                            careerReadiness: data.data.bySector.URBAN.careerReadiness || 0,
                            industryAlignment: data.data.bySector.URBAN.industryAlignment || 0,
                        };
                    }

                    setAnalytics({
                        overall: data.data.overall,
                        bySector,
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching analytics:", error);
            // Set default empty analytics
            setAnalytics({
                overall: {
                    totalSkills: 0,
                    totalProjects: 0,
                    totalCertifications: 0,
                    averageReadiness: 0,
                    sectorsActive: 0,
                },
                bySector: {},
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    const fetchRecommendations = async (sector: string, score: number) => {
        if (score === 0) return [];

        setLoadingRecs(prev => ({ ...prev, [sector]: true }));
        try {
            const resp = (await analyticsApi.getCrossSector()) as CrossSectorResponse;
            if (!resp?.success) {
                throw new Error(resp?.message || "Failed to load analytics overview");
            }
            setData(resp.data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load analytics overview");
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchOverview();
    }, [fetchOverview]);

    const sectorLabel = useMemo(() => {
        const labels: Record<Sector, string> = {
            HEALTHCARE: "Healthcare Informatics",
            AGRICULTURE: "Agricultural Technology",
            URBAN: "Urban & Smart Cities",
        };
        return labels;
    }, []);

    const chartData = useMemo(() => {
        if (!data) return [];
        const sectors: Sector[] = ["HEALTHCARE", "AGRICULTURE", "URBAN"];
        return sectors
            .map((sector) => {
                const row = data.bySector[sector];
                if (!row) return null;
                return {
                    sector: sectorLabel[sector],
                    careerReadiness: row.careerReadiness ?? 0,
                    industryAlignment: row.industryAlignment ?? 0,
                    overall: row.overallScore ?? 0,
                };
            })
            .filter((x): x is NonNullable<typeof x> => Boolean(x));
    }, [data, sectorLabel]);

    const generateAll = async () => {
        setGenerating(true);
        setError("");
        try {
            const sectors: Sector[] = ["HEALTHCARE", "AGRICULTURE", "URBAN"];
            await Promise.all(sectors.map((s) => analyticsApi.generate(s)));
            await fetchOverview();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to generate analytics");
        } finally {
            setGenerating(false);
        }
    };

    const hasAnySectorData = useMemo(() => {
        if (!data) return false;
        const sectors: Sector[] = ["HEALTHCARE", "AGRICULTURE", "URBAN"];
        return sectors.some((s) => Boolean(data.bySector[s]));
    }, [data]);

    const fetchRecommendations = useCallback(async (sector: Sector, score: number): Promise<Recommendation[]> => {
        if (!score) return [];

        setLoadingRecs((prev) => ({ ...prev, [sector]: true }));
        try {
            const resp = (await analyticsApi.getRecommendations(sector, score)) as unknown;
            return extractRecommendations(resp);
        } catch {
            // Backend may not implement recommendations yet — fail silently.
            return [];
        } finally {
            setLoadingRecs((prev) => ({ ...prev, [sector]: false }));
        }
    }, []);

    useEffect(() => {
        if (!data) return;

        const healthcare = data.bySector.HEALTHCARE;
        const agriculture = data.bySector.AGRICULTURE;
        const urban = data.bySector.URBAN;

        if (healthcare?.overallScore) {
            void fetchRecommendations("HEALTHCARE", healthcare.overallScore).then(setHealthcareRecs);
        } else {
            setHealthcareRecs([]);
        }

        if (agriculture?.overallScore) {
            void fetchRecommendations("AGRICULTURE", agriculture.overallScore).then(setAgricultureRecs);
        } else {
            setAgricultureRecs([]);
        }

        if (urban?.overallScore) {
            void fetchRecommendations("URBAN", urban.overallScore).then(setUrbanRecs);
        } else {
            setUrbanRecs([]);
        }
    }, [data, fetchRecommendations]);

    return (
        <div className="space-y-8">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-2xl border border-orange-200/80 bg-white/80 shadow-2xl backdrop-blur-xl p-6 md:p-8 mb-2">
                <div className="absolute inset-0 pointer-events-none" aria-hidden>
                    <div
                        className="absolute inset-0 opacity-70"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 18% 15%, rgba(251,146,60,0.13), transparent 40%), radial-gradient(circle at 82% 5%, rgba(251,191,36,0.13), transparent 36%), radial-gradient(circle at 45% 110%, rgba(251,113,133,0.12), transparent 42%)",
                        }}
                    />
                    <div
                        className="absolute inset-0 opacity-35"
                        style={{
                            backgroundImage:
                                "linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(180deg, rgba(15,23,42,0.05) 1px, transparent 1px)",
                            backgroundSize: "22px 22px",
                        }}
                    />
                </div>
                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-200/60">
                            <BarChart3 className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-orange-700 uppercase tracking-wide">Sector</p>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                                Analytics &amp; Insights
                            </h1>
                            <p className="text-slate-600 font-medium">
                                Cross-sector skill intelligence and career readiness
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => void generateAll()}
                        disabled={generating}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-all font-semibold shadow-md"
                    >
                        <RefreshCw className={`h-4 w-4 ${generating ? "animate-spin" : ""}`} />
                        {generating ? "Generating..." : "Refresh Analytics"}
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            // Generate analytics for all sectors
            const sectors = ["HEALTHCARE", "AGRICULTURE", "URBAN"];
            await Promise.all(
                sectors.map((sector) =>
                    fetch(
                        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/analytics/generate/${sector}`,
                        { method: "POST", headers }
                    )
                )
            );

            // Refetch the analytics
            await fetchAnalytics();
        } catch (error) {
            console.error("Error generating analytics:", error);
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <div className="text-muted-foreground">Loading analytics...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-2xl border border-orange-200/80 bg-white/80 shadow-2xl backdrop-blur-xl p-6 md:p-8 mb-2">
                <div className="absolute inset-0 pointer-events-none" aria-hidden>
                    <div
                        className="absolute inset-0 opacity-70"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 18% 15%, rgba(251,146,60,0.13), transparent 40%), radial-gradient(circle at 82% 5%, rgba(251,191,36,0.13), transparent 36%), radial-gradient(circle at 45% 110%, rgba(251,113,133,0.12), transparent 42%)",
                        }}
                    ></div>
                    <div
                        className="absolute inset-0 opacity-35"
                        style={{
                            backgroundImage:
                                "linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(180deg, rgba(15,23,42,0.05) 1px, transparent 1px)",
                            backgroundSize: "22px 22px",
                        }}
                    ></div>
                </div>
                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-200/60">
                            <BarChart3 className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-orange-700 uppercase tracking-wide">Sector</p>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                                Analytics & Insights
                            </h1>
                            <p className="text-slate-600 font-medium">Cross-sector skill intelligence and career readiness</p>
                        </div>
                    </div>
                    <button
                        onClick={generateAllAnalytics}
                        disabled={generating}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-all font-semibold shadow-md"
                    >
                        <RefreshCw className={`h-4 w-4 ${generating ? "animate-spin" : ""}`} />
                        {generating ? "Generating..." : "Refresh Analytics"}
                    </button>
                </div>
            </div>

            {error ? (
                <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 font-medium">{error}</div>
            ) : null}

            {loading ? (
                <div className="flex items-center justify-center min-h-100">
                    <div className="text-muted-foreground">Loading analytics...</div>
                </div>
            ) : !data ? (
                <div className="p-6 rounded-2xl border border-slate-200 bg-white">
                    <p className="text-slate-700 font-medium">No analytics data yet. Click “Refresh Analytics”.</p>
                </div>
            ) : (
                <>
                    {/* Overall Stats */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="rounded-2xl border border-orange-200/70 bg-white/70 backdrop-blur-lg p-6 flex flex-col items-start shadow-lg relative overflow-hidden">
                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-100/60 rounded-full blur-2xl opacity-60" />
                            <div className="flex items-center justify-between w-full mb-2 z-10">
                                <span className="text-sm text-orange-700 font-semibold">Total Skills</span>
                                <Target className="h-4 w-4 text-orange-500" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 z-10">{data.overall.totalSkills}</div>
                            <p className="text-xs text-slate-500 mt-1 z-10">Across all sectors</p>
                        </div>
                        <div className="rounded-2xl border border-orange-200/70 bg-white/70 backdrop-blur-lg p-6 flex flex-col items-start shadow-lg relative overflow-hidden">
                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-100/60 rounded-full blur-2xl opacity-60" />
                            <div className="flex items-center justify-between w-full mb-2 z-10">
                                <span className="text-sm text-orange-700 font-semibold">Projects</span>
                                <TrendingUp className="h-4 w-4 text-orange-500" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 z-10">{data.overall.totalProjects}</div>
                            <p className="text-xs text-slate-500 mt-1 z-10">Completed</p>
                        </div>
                        <div className="rounded-2xl border border-orange-200/70 bg-white/70 backdrop-blur-lg p-6 flex flex-col items-start shadow-lg relative overflow-hidden">
                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-100/60 rounded-full blur-2xl opacity-60" />
                            <div className="flex items-center justify-between w-full mb-2 z-10">
                                <span className="text-sm text-orange-700 font-semibold">Certifications</span>
                                <Award className="h-4 w-4 text-orange-500" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 z-10">{data.overall.totalCertifications}</div>
                            <p className="text-xs text-slate-500 mt-1 z-10">Active</p>
                        </div>
                        <div className="rounded-2xl border border-orange-200/70 bg-white/70 backdrop-blur-lg p-6 flex flex-col items-start shadow-lg relative overflow-hidden">
                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-100/60 rounded-full blur-2xl opacity-60" />
                            <div className="flex items-center justify-between w-full mb-2 z-10">
                                <span className="text-sm text-orange-700 font-semibold">Overall Score</span>
                                <Brain className="h-4 w-4 text-orange-500" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 z-10">{data.overall.averageReadiness}%</div>
                            <p className="text-xs text-slate-500 mt-1 z-10">Career ready</p>
                        </div>
                        <div className="rounded-2xl border border-orange-200/70 bg-white/70 backdrop-blur-lg p-6 flex flex-col items-start shadow-lg relative overflow-hidden">
                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-100/60 rounded-full blur-2xl opacity-60" />
                            <div className="flex items-center justify-between w-full mb-2 z-10">
                                <span className="text-sm text-orange-700 font-semibold">Active Sectors</span>
                                <BarChart3 className="h-4 w-4 text-orange-500" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 z-10">{data.overall.sectorsActive}</div>
                            <p className="text-xs text-slate-500 mt-1 z-10">With analytics</p>
                        </div>
                    </div>

                    {/* Sector Comparison */}
                    <div className="p-4 md:p-6 rounded-2xl border border-orange-200/60 bg-gradient-to-br from-white via-orange-50/30 to-white backdrop-blur-xl shadow-xl mb-6">
                        <div className="mb-4">
                            <h2 className="text-xl md:text-2xl font-bold mb-1 text-slate-900">Sector Performance Comparison</h2>
                            <p className="text-slate-600 text-xs">
                                Visualize your progress across different sectors with detailed metrics
                            </p>
                        </div>

                        {hasAnySectorData ? (
                            <div className="mb-4">
                                <SectorPerformanceChart data={chartData} height={350} />
                            </div>
                        ) : (
                            <div className="p-6 rounded-xl border border-orange-200 bg-white/70">
                                <p className="text-slate-700 font-medium">No sector analytics yet. Click “Refresh Analytics”.</p>
                            </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-orange-200/40">
                            <h3 className="text-base font-bold text-slate-900 mb-3">Detailed Sector Analysis</h3>
                            <div className="space-y-3">
                                {/* Healthcare */}
                                {data.bySector.HEALTHCARE && data.bySector.HEALTHCARE.overallScore > 0 ? (
                                    <div className="rounded-lg border border-orange-200/60 bg-gradient-to-br from-orange-50/50 to-white p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-sm">🏥</div>
                                                <div>
                                                    <h3 className="font-bold text-sm text-slate-900">{sectorLabel.HEALTHCARE}</h3>
                                                    <p className="text-xs text-slate-600">Medical sector readiness</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-black text-orange-600">{data.bySector.HEALTHCARE.overallScore}%</div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="bg-white rounded-lg p-3 border border-orange-100/40">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-semibold text-slate-700">Career Readiness</span>
                                                    <span className="text-sm font-bold text-orange-600">{data.bySector.HEALTHCARE.careerReadiness}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-orange-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                                                        style={{ width: `${data.bySector.HEALTHCARE.careerReadiness}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border border-orange-100/40">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-semibold text-slate-700">Industry Alignment</span>
                                                    <span className="text-sm font-bold text-orange-600">{data.bySector.HEALTHCARE.industryAlignment}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-orange-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                                                        style={{ width: `${data.bySector.HEALTHCARE.industryAlignment}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}

                                {/* Agriculture */}
                                {data.bySector.AGRICULTURE && data.bySector.AGRICULTURE.overallScore > 0 ? (
                                    <div className="rounded-lg border border-orange-200/60 bg-gradient-to-br from-orange-50/50 to-white p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-sm">🌾</div>
                                                <div>
                                                    <h3 className="font-bold text-sm text-slate-900">{sectorLabel.AGRICULTURE}</h3>
                                                    <p className="text-xs text-slate-600">Agri-tech sector readiness</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-black text-orange-600">{data.bySector.AGRICULTURE.overallScore}%</div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="bg-white rounded-lg p-3 border border-orange-100/40">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-semibold text-slate-700">Career Readiness</span>
                                                    <span className="text-sm font-bold text-orange-600">{data.bySector.AGRICULTURE.careerReadiness}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-orange-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                                                        style={{ width: `${data.bySector.AGRICULTURE.careerReadiness}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border border-orange-100/40">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-semibold text-slate-700">Industry Alignment</span>
                                                    <span className="text-sm font-bold text-orange-600">{data.bySector.AGRICULTURE.industryAlignment}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-orange-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                                                        style={{ width: `${data.bySector.AGRICULTURE.industryAlignment}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}

                                {/* Urban */}
                                {data.bySector.URBAN && data.bySector.URBAN.overallScore > 0 ? (
                                    <div className="rounded-lg border border-orange-200/60 bg-gradient-to-br from-orange-50/50 to-white p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-sm">🏙️</div>
                                                <div>
                                                    <h3 className="font-bold text-sm text-slate-900">{sectorLabel.URBAN}</h3>
                                                    <p className="text-xs text-slate-600">Urban development readiness</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-black text-orange-600">{data.bySector.URBAN.overallScore}%</div>
                                            </div>
                        {/* Urban */}
                        {analytics?.bySector.URBAN && analytics.bySector.URBAN.overallScore > 0 && (
                            <div className="rounded-lg border border-orange-200/60 bg-gradient-to-br from-orange-50/50 to-white p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-sm">
                                            🏙️
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-slate-900">Urban & Smart Cities</h3>
                                            <p className="text-xs text-slate-600">Urban development readiness</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-orange-600">
                                            {analytics.bySector.URBAN.overallScore}%
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="bg-white rounded-lg p-4 border border-orange-100/40">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-sm font-semibold text-slate-700">Career Readiness</span>
                                                    <span className="text-lg font-bold text-orange-600">{data.bySector.URBAN.careerReadiness}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                                                        style={{ width: `${data.bySector.URBAN.careerReadiness}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-lg p-4 border border-orange-100/40">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-sm font-semibold text-slate-700">Industry Alignment</span>
                                                    <span className="text-lg font-bold text-orange-600">{data.bySector.URBAN.industryAlignment}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                                                        style={{ width: `${data.bySector.URBAN.industryAlignment}%` }}
                                                    />
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-white rounded-lg p-4 border border-orange-100/40">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm font-semibold text-slate-700">Career Readiness</span>
                                            <span className="text-lg font-bold text-orange-600">
                                                {analytics.bySector.URBAN.careerReadiness}%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                                                style={{ width: `${analytics.bySector.URBAN.careerReadiness}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 border border-orange-100/40">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm font-semibold text-slate-700">Industry Alignment</span>
                                            <span className="text-lg font-bold text-orange-600">
                                                {analytics.bySector.URBAN.industryAlignment}%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                                                style={{ width: `${analytics.bySector.URBAN.industryAlignment}%` }}
                                            />
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* AI-Powered Recommendations */}
                    <div className="p-6 md:p-8 rounded-2xl border border-purple-200/60 bg-white/70 backdrop-blur-xl shadow-xl mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">AI-Powered Recommendations</h2>
                            <Link
                                href="/dashboard/chatbot"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 transition-all border border-purple-200/60 text-purple-700 hover:text-purple-900"
                            >
                                <MessageCircle className="h-4 w-4" />
                                <span className="text-sm font-medium hidden md:inline">AI Assistant</span>
                            </Link>
                        </div>
            {/* AI-Powered Recommendations by Sector */}
            <div className="p-6 md:p-8 rounded-2xl border border-purple-200/60 bg-white/70 backdrop-blur-xl shadow-xl mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">AI-Powered Recommendations</h2>
                    <Link
                        href="/dashboard/chatbot"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 transition-all border border-orange-200/60 text-slate-700 hover:text-slate-900"
                    >
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm font-medium hidden md:inline">AI Assistant</span>
                    </Link>
                </div>

                        <div className="space-y-6">
                            {/* Healthcare Recommendations */}
                            {data.bySector.HEALTHCARE && data.bySector.HEALTHCARE.overallScore > 0 ? (
                                <div className="p-6 rounded-xl border border-blue-200/60 bg-white/50 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                                <Activity className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900">{sectorLabel.HEALTHCARE}</h2>
                                                <p className="text-sm text-slate-600">
                                                    Competency Score: {data.bySector.HEALTHCARE.overallScore}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                <div className="space-y-6">
                    {/* Healthcare Recommendations */}
                    {analytics?.bySector.HEALTHCARE && analytics.bySector.HEALTHCARE.overallScore > 0 && (
                        <div className="p-6 rounded-xl border border-orange-200/60 bg-white/50 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                        <Activity className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">Healthcare Informatics</h2>
                                        <p className="text-sm text-slate-700">Competency Score: {analytics.bySector.HEALTHCARE.overallScore}%</p>
                                    </div>
                                </div>
                            </div>

                                    {loadingRecs.HEALTHCARE ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                                        </div>
                                    ) : healthcareRecs.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Sparkles className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                            <p className="text-slate-600 text-lg font-medium">No recommendations yet.</p>
                                            <p className="text-slate-500 text-sm mt-1">
                                                If the backend recommendations endpoint isn’t enabled, this stays empty.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {(() => {
                                                const news = healthcareRecs.filter((r) => r.type === "news").slice(0, 3);
                                                const opportunities = healthcareRecs
                                                    .filter((r) => r.type === "opportunity")
                                                    .slice(0, 3);
                                                const total = Math.min(news.length + opportunities.length, 5);

                                                return (
                                                    <>
                                                        {news.length > 0 ? (
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <Newspaper className="h-5 w-5 text-blue-600" />
                                                                    <h3 className="text-sm font-bold text-slate-700">Industry News &amp; Trends</h3>
                                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                                        {news.length}
                                                                    </span>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {news.map((rec, index) => (
                                                                        <div
                                                                            key={`${rec.title}-${index}`}
                                                                            className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 shadow-sm hover:shadow-md transition-shadow"
                                                                        >
                                                                            <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                                            <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
                                                                            {rec.source ? (
                                                                                <p className="text-xs text-slate-500 mt-2">
                                                                                    {rec.source}{" "}
                                                                                    {rec.date ? `• ${rec.date}` : null}
                                                                                </p>
                                                                            ) : null}
                                                                            {rec.url ? (
                                                                                <a
                                                                                    href={rec.url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                                                                                >
                                                                                    Learn more →
                                                                                </a>
                                                                            ) : null}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : null}
                            {loadingRecs.HEALTHCARE ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                                </div>
                            ) : healthcareRecs.length === 0 ? (
                                <div className="text-center py-12">
                                    <Sparkles className="h-16 w-16 text-orange-200 mx-auto mb-4" />
                                    <p className="text-slate-700 text-lg font-medium">Fetching AI recommendations...</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {(() => {
                                        const news = healthcareRecs.filter(r => r.type === "news").slice(0, 3);
                                        const opportunities = healthcareRecs.filter(r => r.type === "opportunity").slice(0, 3);
                                        const total = Math.min(news.length + opportunities.length, 5);

                                        return (
                                            <>
                                                {news.length > 0 && (
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Newspaper className="h-5 w-5 text-orange-600" />
                                                            <h3 className="text-sm font-bold text-slate-900">Industry News & Trends</h3>
                                                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">{news.length}</span>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {news.map((rec, index) => (
                                                                <div key={index} className="p-4 rounded-xl border border-orange-100 bg-orange-50/50 shadow-sm hover:shadow-md transition-shadow">
                                                                    <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                                    <p className="text-xs text-slate-700 mt-1">{rec.description}</p>
                                                                    {rec.source && (
                                                                        <p className="text-xs text-slate-500 mt-2">{rec.source} {rec.date && `• ${rec.date}`}</p>
                                                                    )}
                                                                    {rec.url && (
                                                                        <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-600 hover:underline mt-2 inline-block">
                                                                            Learn more →
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                        {opportunities.length > 0 ? (
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <Briefcase className="h-5 w-5 text-blue-600" />
                                                                    <h3 className="text-sm font-bold text-slate-700">Career Opportunities</h3>
                                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                                        {opportunities.length}
                                                                    </span>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {opportunities.map((rec, index) => (
                                                                        <div
                                                                            key={`${rec.title}-${index}`}
                                                                            className="p-4 rounded-xl border border-blue-200 bg-white/80 shadow-sm hover:shadow-md transition-shadow"
                                                                        >
                                                                            <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                                            <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
                                                                            {rec.source ? (
                                                                                <p className="text-xs text-slate-500 mt-2">
                                                                                    {rec.source}{" "}
                                                                                    {rec.date ? `• ${rec.date}` : null}
                                                                                </p>
                                                                            ) : null}
                                                                            {rec.url ? (
                                                                                <a
                                                                                    href={rec.url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                                                                                >
                                                                                    Learn more →
                                                                                </a>
                                                                            ) : null}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                {opportunities.length > 0 && (
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Briefcase className="h-5 w-5 text-orange-600" />
                                                            <h3 className="text-sm font-bold text-slate-900">Career Opportunities</h3>
                                                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">{opportunities.length}</span>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {opportunities.map((rec, index) => (
                                                                <div key={index} className="p-4 rounded-xl border border-orange-200 bg-white/80 shadow-sm hover:shadow-md transition-shadow">
                                                                    <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                                    <p className="text-xs text-slate-700 mt-1">{rec.description}</p>
                                                                    {rec.source && (
                                                                        <p className="text-xs text-slate-500 mt-2">{rec.source} {rec.date && `• ${rec.date}`}</p>
                                                                    )}
                                                                    {rec.url && (
                                                                        <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-600 hover:underline mt-2 inline-block">
                                                                            Learn more →
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                        <div className="flex items-center justify-center text-xs text-slate-500 pt-2">
                                                            Showing {total} recommendations
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    )}
                                </div>
                            ) : null}
                                                <div className="flex items-center justify-center text-xs text-orange-400 pt-2">
                                                    Showing {total} of {Math.min(healthcareRecs.length, 5)} recommendations
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    )}

                            {/* Agriculture Recommendations */}
                            {data.bySector.AGRICULTURE && data.bySector.AGRICULTURE.overallScore > 0 ? (
                                <div className="p-6 rounded-xl border border-green-200/60 bg-white/50 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                                <Sprout className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900">{sectorLabel.AGRICULTURE}</h2>
                                                <p className="text-sm text-slate-600">
                                                    Innovation Score: {data.bySector.AGRICULTURE.overallScore}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                    {/* Agriculture Recommendations */}
                    {analytics?.bySector.AGRICULTURE && analytics.bySector.AGRICULTURE.overallScore > 0 && (
                        <div className="p-6 rounded-xl border border-green-200/60 bg-white/50 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                        <Sprout className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">Agricultural Technology</h2>
                                        <p className="text-sm text-slate-600">Innovation Score: {analytics.bySector.AGRICULTURE.overallScore}%</p>
                                    </div>
                                </div>

                                    {loadingRecs.AGRICULTURE ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
                                        </div>
                                    ) : agricultureRecs.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Sparkles className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                            <p className="text-slate-600 text-lg font-medium">No recommendations yet.</p>
                                            <p className="text-slate-500 text-sm mt-1">
                                                If the backend recommendations endpoint isn’t enabled, this stays empty.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {(() => {
                                                const news = agricultureRecs.filter((r) => r.type === "news").slice(0, 3);
                                                const opportunities = agricultureRecs
                                                    .filter((r) => r.type === "opportunity")
                                                    .slice(0, 3);
                                                const total = Math.min(news.length + opportunities.length, 5);
                                {loadingRecs.AGRICULTURE ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                                    </div>
                                ) : agricultureRecs.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Sparkles className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-600 text-lg font-medium">Fetching AI recommendations...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {(() => {
                                            const news = agricultureRecs.filter(r => r.type === "news").slice(0, 3);
                                            const opportunities = agricultureRecs.filter(r => r.type === "opportunity").slice(0, 3);
                                            const total = Math.min(news.length + opportunities.length, 5);

                                                return (
                                                    <>
                                                        {news.length > 0 ? (
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <Newspaper className="h-5 w-5 text-green-600" />
                                                                    <h3 className="text-sm font-bold text-slate-700">Industry News &amp; Trends</h3>
                                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                                        {news.length}
                                                                    </span>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {news.map((rec, index) => (
                                                                        <div
                                                                            key={`${rec.title}-${index}`}
                                                                            className="p-4 rounded-xl border border-green-100 bg-green-50/50 shadow-sm hover:shadow-md transition-shadow"
                                                                        >
                                                                            <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                                            <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
                                                                            {rec.source ? (
                                                                                <p className="text-xs text-slate-500 mt-2">
                                                                                    {rec.source}{" "}
                                                                                    {rec.date ? `• ${rec.date}` : null}
                                                                                </p>
                                                                            ) : null}
                                                                            {rec.url ? (
                                                                                <a
                                                                                    href={rec.url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-xs text-green-600 hover:underline mt-2 inline-block"
                                                                                >
                                                                                    Learn more →
                                                                                </a>
                                                                            ) : null}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                            return (
                                                <>
                                                    {news.length > 0 && (
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <Newspaper className="h-5 w-5 text-green-600" />
                                                                <h3 className="text-sm font-bold text-slate-700">Industry News & Trends</h3>
                                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{news.length}</span>
                                                            </div>
                                                            <div className="space-y-3">
                                                                {news.map((rec, index) => (
                                                                    <div key={index} className="p-4 rounded-xl border border-green-100 bg-green-50/50 shadow-sm hover:shadow-md transition-shadow">
                                                                        <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                                        <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
                                                                        {rec.source && (
                                                                            <p className="text-xs text-slate-500 mt-2">{rec.source} {rec.date && `• ${rec.date}`}</p>
                                                                        )}
                                                                        {rec.url && (
                                                                            <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline mt-2 inline-block">
                                                                                Learn more →
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                        {opportunities.length > 0 ? (
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <Briefcase className="h-5 w-5 text-green-600" />
                                                                    <h3 className="text-sm font-bold text-slate-700">Career Opportunities</h3>
                                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                                        {opportunities.length}
                                                                    </span>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {opportunities.map((rec, index) => (
                                                                        <div
                                                                            key={`${rec.title}-${index}`}
                                                                            className="p-4 rounded-xl border border-green-200 bg-white/80 shadow-sm hover:shadow-md transition-shadow"
                                                                        >
                                                                            <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                                            <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
                                                                            {rec.source ? (
                                                                                <p className="text-xs text-slate-500 mt-2">
                                                                                    {rec.source}{" "}
                                                                                    {rec.date ? `• ${rec.date}` : null}
                                                                                </p>
                                                                            ) : null}
                                                                            {rec.url ? (
                                                                                <a
                                                                                    href={rec.url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-xs text-green-600 hover:underline mt-2 inline-block"
                                                                                >
                                                                                    Learn more →
                                                                                </a>
                                                                            ) : null}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    {opportunities.length > 0 && (
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <Briefcase className="h-5 w-5 text-green-600" />
                                                                <h3 className="text-sm font-bold text-slate-700">Career Opportunities</h3>
                                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{opportunities.length}</span>
                                                            </div>
                                                            <div className="space-y-3">
                                                                {opportunities.map((rec, index) => (
                                                                    <div key={index} className="p-4 rounded-xl border border-green-200 bg-white/80 shadow-sm hover:shadow-md transition-shadow">
                                                                        <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                                        <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
                                                                        {rec.source && (
                                                                            <p className="text-xs text-slate-500 mt-2">{rec.source} {rec.date && `• ${rec.date}`}</p>
                                                                        )}
                                                                        {rec.url && (
                                                                            <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline mt-2 inline-block">
                                                                                Learn more →
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                        <div className="flex items-center justify-center text-xs text-slate-500 pt-2">
                                                            Showing {total} recommendations
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    )}
                                </div>
                            ) : null}
                                                    <div className="flex items-center justify-center text-xs text-slate-500 pt-2">
                                                        Showing {total} of {Math.min(agricultureRecs.length, 5)} recommendations
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                            {/* Urban Recommendations */}
                            {data.bySector.URBAN && data.bySector.URBAN.overallScore > 0 ? (
                                <div className="p-6 rounded-xl border border-cyan-200/60 bg-white/50 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                                                <Building2 className="h-5 w-5 text-cyan-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900">{sectorLabel.URBAN}</h2>
                                                <p className="text-sm text-slate-600">
                                                    Readiness Score: {data.bySector.URBAN.overallScore}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                    {/* Urban Recommendations */}
                    {analytics?.bySector.URBAN && analytics.bySector.URBAN.overallScore > 0 && (
                        <div className="p-6 rounded-xl border border-cyan-200/60 bg-white/50 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                                        <Building2 className="h-5 w-5 text-cyan-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">Urban & Smart Cities</h2>
                                        <p className="text-sm text-slate-600">Readiness Score: {analytics.bySector.URBAN.overallScore}%</p>
                                    </div>
                                </div>

                                    {loadingRecs.URBAN ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600" />
                                        </div>
                                    ) : urbanRecs.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Sparkles className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                            <p className="text-slate-600 text-lg font-medium">No recommendations yet.</p>
                                            <p className="text-slate-500 text-sm mt-1">
                                                If the backend recommendations endpoint isn’t enabled, this stays empty.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {(() => {
                                                const news = urbanRecs.filter((r) => r.type === "news").slice(0, 3);
                                                const opportunities = urbanRecs
                                                    .filter((r) => r.type === "opportunity")
                                                    .slice(0, 3);
                                                const total = Math.min(news.length + opportunities.length, 5);
                                {loadingRecs.URBAN ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
                                    </div>
                                ) : urbanRecs.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Sparkles className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-600 text-lg font-medium">Fetching AI recommendations...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {(() => {
                                            const news = urbanRecs.filter(r => r.type === "news").slice(0, 3);
                                            const opportunities = urbanRecs.filter(r => r.type === "opportunity").slice(0, 3);
                                            const total = Math.min(news.length + opportunities.length, 5);

                                                return (
                                                    <>
                                                        {news.length > 0 ? (
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <Newspaper className="h-5 w-5 text-cyan-600" />
                                                                    <h3 className="text-sm font-bold text-slate-700">Industry News &amp; Trends</h3>
                                                                    <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">
                                                                        {news.length}
                                                                    </span>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {news.map((rec, index) => (
                                                                        <div
                                                                            key={`${rec.title}-${index}`}
                                                                            className="p-4 rounded-xl border border-cyan-100 bg-cyan-50/50 shadow-sm hover:shadow-md transition-shadow"
                                                                        >
                                                                            <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                                            <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
                                                                            {rec.source ? (
                                                                                <p className="text-xs text-slate-500 mt-2">
                                                                                    {rec.source}{" "}
                                                                                    {rec.date ? `• ${rec.date}` : null}
                                                                                </p>
                                                                            ) : null}
                                                                            {rec.url ? (
                                                                                <a
                                                                                    href={rec.url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-xs text-cyan-600 hover:underline mt-2 inline-block"
                                                                                >
                                                                                    Learn more →
                                                                                </a>
                                                                            ) : null}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                            return (
                                                <>
                                                    {news.length > 0 && (
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <Newspaper className="h-5 w-5 text-cyan-600" />
                                                                <h3 className="text-sm font-bold text-slate-700">Industry News & Trends</h3>
                                                                <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">{news.length}</span>
                                                            </div>
                                                            <div className="space-y-3">
                                                                {news.map((rec, index) => (
                                                                    <div key={index} className="p-4 rounded-xl border border-cyan-100 bg-cyan-50/50 shadow-sm hover:shadow-md transition-shadow">
                                                                        <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                                        <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
                                                                        {rec.source && (
                                                                            <p className="text-xs text-slate-500 mt-2">{rec.source} {rec.date && `• ${rec.date}`}</p>
                                                                        )}
                                                                        {rec.url && (
                                                                            <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-600 hover:underline mt-2 inline-block">
                                                                                Learn more →
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                        {opportunities.length > 0 ? (
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <Briefcase className="h-5 w-5 text-cyan-600" />
                                                                    <h3 className="text-sm font-bold text-slate-700">Career Opportunities</h3>
                                                                    <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">
                                                                        {opportunities.length}
                                                                    </span>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {opportunities.map((rec, index) => (
                                                                        <div
                                                                            key={`${rec.title}-${index}`}
                                                                            className="p-4 rounded-xl border border-cyan-200 bg-white/80 shadow-sm hover:shadow-md transition-shadow"
                                                                        >
                                                                            <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                                            <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
                                                                            {rec.source ? (
                                                                                <p className="text-xs text-slate-500 mt-2">
                                                                                    {rec.source}{" "}
                                                                                    {rec.date ? `• ${rec.date}` : null}
                                                                                </p>
                                                                            ) : null}
                                                                            {rec.url ? (
                                                                                <a
                                                                                    href={rec.url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-xs text-cyan-600 hover:underline mt-2 inline-block"
                                                                                >
                                                                                    Learn more →
                                                                                </a>
                                                                            ) : null}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    {opportunities.length > 0 && (
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <Briefcase className="h-5 w-5 text-cyan-600" />
                                                                <h3 className="text-sm font-bold text-slate-700">Career Opportunities</h3>
                                                                <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">{opportunities.length}</span>
                                                            </div>
                                                            <div className="space-y-3">
                                                                {opportunities.map((rec, index) => (
                                                                    <div key={index} className="p-4 rounded-xl border border-cyan-200 bg-white/80 shadow-sm hover:shadow-md transition-shadow">
                                                                        <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                                        <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
                                                                        {rec.source && (
                                                                            <p className="text-xs text-slate-500 mt-2">{rec.source} {rec.date && `• ${rec.date}`}</p>
                                                                        )}
                                                                        {rec.url && (
                                                                            <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-600 hover:underline mt-2 inline-block">
                                                                                Learn more →
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                        <div className="flex items-center justify-center text-xs text-slate-500 pt-2">
                                                            Showing {total} recommendations
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>
                                                    <div className="flex items-center justify-center text-xs text-slate-500 pt-2">
                                                        Showing {total} of {Math.min(urbanRecs.length, 5)} recommendations
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>

                            {loadingRecs.URBAN ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
                                </div>
                            ) : urbanRecs.length === 0 ? (
                                <div className="text-center py-12">
                                    <Sparkles className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-600 text-lg font-medium">Fetching AI recommendations...</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {(() => {
                                        const news = urbanRecs.filter(r => r.type === "news").slice(0, 3);
                                        const opportunities = urbanRecs.filter(r => r.type === "opportunity").slice(0, 3);

                                        return (
                                            <>
                                                {news.length > 0 && (
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Newspaper className="h-5 w-5 text-cyan-600" />
                                                            <h3 className="text-sm font-bold text-slate-700">Industry News & Trends</h3>
                                                            <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">{news.length}</span>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {news.map((rec, index) => (
                                                                <div key={index} className="p-4 rounded-xl border border-cyan-100 bg-cyan-50/50 shadow-sm hover:shadow-md transition-shadow">
                                                                    <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                                    <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
                                                                    {rec.source && (
                                                                        <p className="text-xs text-slate-500 mt-2">{rec.source} {rec.date && `• ${rec.date}`}</p>
                                                                    )}
                                                                    {rec.url && (
                                                                        <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-600 hover:underline mt-2 inline-block">
                                                                            Learn more →
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {opportunities.length > 0 && (
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Briefcase className="h-5 w-5 text-cyan-600" />
                                                            <h3 className="text-sm font-bold text-slate-700">Career Opportunities</h3>
                                                            <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">{opportunities.length}</span>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {opportunities.map((rec, index) => (
                                                                <div key={index} className="p-4 rounded-xl border border-cyan-200 bg-white/80 shadow-sm hover:shadow-md transition-shadow">
                                                                    <h4 className="font-semibold text-slate-900 text-sm">{rec.title}</h4>
                                                                    <p className="text-xs text-slate-600 mt-1">{rec.description}</p>
                                                                    {rec.source && (
                                                                        <p className="text-xs text-slate-500 mt-2">{rec.source} {rec.date && `• ${rec.date}`}</p>
                                                                    )}
                                                                    {rec.url && (
                                                                        <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-600 hover:underline mt-2 inline-block">
                                                                            Learn more →
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

                    {/* Score Calculation Footer */}
                    <div className="mt-12 space-y-2 text-xs text-slate-600">
                        <div className="flex items-start gap-2">
                            <span className="font-bold text-slate-400">*</span>
                            <p>
                                <strong>Overall Score:</strong> (Avg Proficiency / 5) × 40 + Min(Certifications × 10, 30) +
                                Min(Completed Projects × 6, 30)
                            </p>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="font-bold text-slate-400">*</span>
                            <p>
                                <strong>Career Readiness:</strong> (Verified Skills / Total Skills) × 50% + Min(Active Certifications × 10, 50%)
                            </p>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="font-bold text-slate-400">*</span>
                            <p>
                                <strong>Industry Alignment:</strong> (Skill Count / 10) × 30% + (Avg Proficiency / 5) × 30% +
                                Min(Completed Projects × 8, 25%) + Min(Public Projects × 5, 15%)
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
