"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
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

import { analyticsApi } from "@/lib/api";
import { SectorPerformanceChart } from "@/components/sector-performance-chart";

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

function clampPercent(value: number): number {
    if (Number.isNaN(value)) return 0;
    return Math.max(0, Math.min(100, Math.round(value)));
}

function formatCalculatedAt(value?: string): string {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
    }).format(date);
}

function scoreChipClass(score: number): string {
    if (score >= 75) return "bg-orange-600 text-white";
    if (score >= 50) return "bg-orange-200 text-orange-950";
    return "bg-orange-100 text-orange-900";
}

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

    const sectorLabel = useMemo(() => {
        const labels: Record<Sector, string> = {
            HEALTHCARE: "Healthcare Informatics",
            AGRICULTURE: "Agricultural Technology",
            URBAN: "Urban & Smart Cities",
        };
        return labels;
    }, []);

    const fetchOverview = useCallback(async () => {
        setLoading(true);
        setError("");
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

    const fetchRecommendations = useCallback(async (sector: Sector, score: number) => {
        if (!score || score <= 0) return;

        setLoadingRecs((prev) => ({ ...prev, [sector]: true }));
        try {
            const payload = await analyticsApi.getRecommendations(sector, score);
            const recs = extractRecommendations(payload);
            if (sector === "HEALTHCARE") setHealthcareRecs(recs);
            if (sector === "AGRICULTURE") setAgricultureRecs(recs);
            if (sector === "URBAN") setUrbanRecs(recs);
        } catch {
            if (sector === "HEALTHCARE") setHealthcareRecs([]);
            if (sector === "AGRICULTURE") setAgricultureRecs([]);
            if (sector === "URBAN") setUrbanRecs([]);
        } finally {
            setLoadingRecs((prev) => ({ ...prev, [sector]: false }));
        }
    }, []);

    const handleGenerate = useCallback(async () => {
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
    }, [fetchOverview]);

    useEffect(() => {
        void fetchOverview();
    }, [fetchOverview]);

    useEffect(() => {
        if (!data) return;
        const sectors: Sector[] = ["HEALTHCARE", "AGRICULTURE", "URBAN"];
        for (const sector of sectors) {
            const row = data.bySector[sector];
            const score = row?.overallScore ?? 0;
            void fetchRecommendations(sector, score);
        }
    }, [data, fetchRecommendations]);

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

    const overall = data?.overall;

    const recsBySector: Array<{ sector: Sector; icon: React.ReactElement; recs: Recommendation[] }> = [
        { sector: "HEALTHCARE", icon: <Activity className="w-5 h-5 text-orange-600" />, recs: healthcareRecs },
        { sector: "AGRICULTURE", icon: <Sprout className="w-5 h-5 text-orange-600" />, recs: agricultureRecs },
        { sector: "URBAN", icon: <Building2 className="w-5 h-5 text-orange-600" />, recs: urbanRecs },
    ];

    const sectorRoutes: Record<Sector, string> = {
        HEALTHCARE: "/dashboard/healthcare",
        AGRICULTURE: "/dashboard/agriculture",
        URBAN: "/dashboard/urban",
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-orange-600" /> Analytics &amp; Insights
                    </h1>
                    <p className="text-sm text-slate-600">
                        Cross-sector performance overview and AI-powered recommendations.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => void fetchOverview()}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-orange-200 bg-white/80 dark:bg-gray-900/70 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-gray-800 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
                    </button>
                    <button
                        type="button"
                        onClick={() => void handleGenerate()}
                        disabled={generating}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-600 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
                    >
                        <Sparkles className={`w-4 h-4 ${generating ? "animate-pulse" : ""}`} /> Generate
                    </button>
                </div>
            </div>

            {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-orange-300 bg-orange-50 p-4 shadow-lg shadow-orange-200/60 transition-shadow hover:shadow-xl hover:shadow-orange-300/80">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Target className="w-4 h-4 text-orange-600" /> Total Skills
                    </div>
                    <div className="mt-2 text-2xl font-bold text-slate-900">{overall?.totalSkills ?? 0}</div>
                </div>
                <div className="rounded-2xl border border-orange-300 bg-orange-50 p-4 shadow-lg shadow-orange-200/60 transition-shadow hover:shadow-xl hover:shadow-orange-300/80">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Award className="w-4 h-4 text-orange-600" /> Certifications
                    </div>
                    <div className="mt-2 text-2xl font-bold text-slate-900">
                        {overall?.totalCertifications ?? 0}
                    </div>
                </div>
                <div className="rounded-2xl border border-orange-300 bg-orange-50 p-4 shadow-lg shadow-orange-200/60 transition-shadow hover:shadow-xl hover:shadow-orange-300/80">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Briefcase className="w-4 h-4 text-orange-600" /> Projects
                    </div>
                    <div className="mt-2 text-2xl font-bold text-slate-900">{overall?.totalProjects ?? 0}</div>
                </div>
                <div className="rounded-2xl border border-orange-300 bg-orange-50 p-4 shadow-lg shadow-orange-200/60 transition-shadow hover:shadow-xl hover:shadow-orange-300/80">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <TrendingUp className="w-4 h-4 text-orange-600" /> Avg Readiness
                    </div>
                    <div className="mt-2 text-2xl font-bold text-slate-900">{overall?.averageReadiness ?? 0}%</div>
                </div>
            </div>

            <SectorPerformanceChart data={chartData} />

            <div className="rounded-2xl border border-orange-200/60 bg-orange-50 p-6">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-orange-600" /> Sector Breakdown
                    </h2>
                    <div className="text-xs text-slate-600">
                        Updated {formatCalculatedAt(data?.bySector.HEALTHCARE?.calculatedAt || data?.bySector.AGRICULTURE?.calculatedAt || data?.bySector.URBAN?.calculatedAt)}
                    </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {(["HEALTHCARE", "AGRICULTURE", "URBAN"] as const).map((sector) => {
                        const row = data?.bySector[sector];
                        const overallScore = clampPercent(row?.overallScore ?? 0);
                        const careerReadiness = clampPercent(row?.careerReadiness ?? 0);
                        const industryAlignment = clampPercent(row?.industryAlignment ?? 0);

                        return (
                            <div
                                key={sector}
                                className="rounded-2xl border border-orange-300 bg-orange-50 p-4 shadow-lg shadow-orange-200/60"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">
                                            {sectorLabel[sector]}
                                        </div>
                                        <div className="mt-1 text-xs text-slate-600">
                                            Calculated: {formatCalculatedAt(row?.calculatedAt)}
                                        </div>
                                    </div>
                                    <div
                                        className="shrink-0 rounded-full px-3 py-1 text-xs font-bold bg-orange-100 text-orange-900 border border-orange-200"
                                        title="Composite score across readiness + alignment"
                                    >
                                        {overallScore}%
                                    </div>
                                </div>

                                <div className="mt-4 space-y-3">
                                    <div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-semibold text-slate-900">
                                                Career readiness
                                            </span>
                                            <span className="text-slate-600">{careerReadiness}%</span>
                                        </div>
                                        <div className="mt-1 h-2 rounded-full bg-orange-100 overflow-hidden">
                                            <div
                                                className="h-full bg-orange-600"
                                                style={{ width: `${careerReadiness}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-semibold text-slate-900">
                                                Industry alignment
                                            </span>
                                            <span className="text-slate-600">{industryAlignment}%</span>
                                        </div>
                                        <div className="mt-1 h-2 rounded-full bg-orange-100 overflow-hidden">
                                            <div
                                                className="h-full bg-orange-500"
                                                style={{ width: `${industryAlignment}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between gap-2">
                                    <div className="text-xs text-slate-600">
                                        {row
                                            ? overallScore >= 75
                                                ? "Strong performance — keep building depth."
                                                : overallScore >= 50
                                                  ? "Good baseline — add projects/certs for lift."
                                                  : "Needs improvement — add skills + evidence."
                                            : "No data yet — generate analytics to begin."}
                                    </div>
                                    <Link
                                        href={sectorRoutes[sector]}
                                        className="inline-flex items-center gap-1 rounded-xl border border-orange-200 px-3 py-2 text-xs font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 hover:text-orange-900"
                                    >
                                        View
                                        <TrendingUp className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="rounded-2xl border border-orange-200/60 bg-blue-50 p-6 space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-orange-600" /> AI-Powered Recommendations
                    </h2>
                    <Link
                        href="/dashboard/chatbot"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-600 text-sm font-semibold text-white hover:bg-orange-700"
                    >
                        <MessageCircle className="w-4 h-4" /> Ask AI Assistant
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {recsBySector.map(({ sector, icon, recs }) => (
                        <div key={sector} className="rounded-2xl border border-orange-300 bg-orange-50 p-4 shadow-lg shadow-orange-200/60 transition-shadow hover:shadow-xl hover:shadow-orange-300/80">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 font-semibold text-slate-900">
                                    {icon} {sectorLabel[sector]}
                                </div>
                                {loadingRecs[sector] ? <div className="text-xs text-slate-500">Loading…</div> : null}
                            </div>

                            <div className="mt-3 space-y-3">
                                {recs.length ? (
                                    recs.slice(0, 4).map((r, idx) => (
                                        <div key={idx} className="rounded-xl border border-orange-100 bg-orange-100 p-3">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                                {r.type === "news" ? (
                                                    <Newspaper className="w-4 h-4 text-orange-600" />
                                                ) : (
                                                    <Briefcase className="w-4 h-4 text-orange-600" />
                                                )}
                                                {r.title}
                                            </div>
                                            <p className="mt-1 text-xs text-slate-700">{r.description}</p>
                                            {r.url ? (
                                                <a
                                                    href={r.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-2 inline-block text-xs font-semibold text-orange-700 hover:underline"
                                                >
                                                    View
                                                </a>
                                            ) : null}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-slate-600">No recommendations yet.</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-2xl border border-orange-200/60 bg-blue-50 p-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-600" /> Details &amp; Methodology
                </h2>

                <div className="mt-3 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <Target className="w-4 h-4 text-orange-600" /> What the scores mean
                        </div>
                        <p className="mt-2 text-sm text-slate-700">
                            Scores run from 0–100. Higher indicates stronger readiness and alignment for the selected sector.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <Award className="w-4 h-4 text-orange-600" /> What improves them
                        </div>
                        <p className="mt-2 text-sm text-slate-700">
                            Add verified skills, complete relevant projects, and attach certifications to build evidence.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <Newspaper className="w-4 h-4 text-orange-600" /> Why AI may show none
                        </div>
                        <p className="mt-2 text-sm text-slate-700">
                            Recommendations depend on the availability of the AI endpoint and your current sector score.
                        </p>
                    </div>
                </div>

                <div className="mt-4 rounded-2xl border border-orange-200/50 bg-white/70 p-4">
                    <div className="text-sm font-bold text-slate-900 mb-2">Quick interpretation</div>
                    <div className="grid gap-4 md:grid-cols-3 rounded-xl p-4">
                        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 flex flex-col justify-center">
                            <div className="text-xs font-bold text-slate-900 mb-1">75–100</div>
                            <div className="text-sm text-slate-700">Strong — keep specializing.</div>
                        </div>
                        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 flex flex-col justify-center">
                            <div className="text-xs font-bold text-slate-900 mb-1">50–74</div>
                            <div className="text-sm text-slate-700">Growing — add proof points.</div>
                        </div>
                        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 flex flex-col justify-center">
                            <div className="text-xs font-bold text-slate-900 mb-1">0–49</div>
                            <div className="text-sm text-slate-700">Early — start with basics.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
