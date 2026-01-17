"use client";

import { useCallback, useEffect, useState } from "react";
import { BarChart3, TrendingUp, Target, Award, Brain, RefreshCw, Lightbulb, Download } from "lucide-react";

interface SectorAnalytics {
    overallScore: number;
    careerReadiness: number;
    industryAlignment: number;
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

    const generateAllAnalytics = async () => {
        setGenerating(true);
        try {
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

            {/* Overall Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="rounded-2xl border border-orange-200/70 bg-white/70 backdrop-blur-lg p-6 flex flex-col items-start shadow-lg relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-100/60 rounded-full blur-2xl opacity-60" />
                    <div className="flex items-center justify-between w-full mb-2 z-10">
                        <span className="text-sm text-orange-700 font-semibold">Total Skills</span>
                        <Target className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 z-10">{analytics?.overall.totalSkills || 0}</div>
                    <p className="text-xs text-slate-500 mt-1 z-10">Across all sectors</p>
                </div>
                <div className="rounded-2xl border border-orange-200/70 bg-white/70 backdrop-blur-lg p-6 flex flex-col items-start shadow-lg relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-100/60 rounded-full blur-2xl opacity-60" />
                    <div className="flex items-center justify-between w-full mb-2 z-10">
                        <span className="text-sm text-orange-700 font-semibold">Projects</span>
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 z-10">{analytics?.overall.totalProjects || 0}</div>
                    <p className="text-xs text-slate-500 mt-1 z-10">Completed</p>
                </div>
                <div className="rounded-2xl border border-orange-200/70 bg-white/70 backdrop-blur-lg p-6 flex flex-col items-start shadow-lg relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-100/60 rounded-full blur-2xl opacity-60" />
                    <div className="flex items-center justify-between w-full mb-2 z-10">
                        <span className="text-sm text-orange-700 font-semibold">Certifications</span>
                        <Award className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 z-10">{analytics?.overall.totalCertifications || 0}</div>
                    <p className="text-xs text-slate-500 mt-1 z-10">Active</p>
                </div>
                <div className="rounded-2xl border border-orange-200/70 bg-white/70 backdrop-blur-lg p-6 flex flex-col items-start shadow-lg relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-100/60 rounded-full blur-2xl opacity-60" />
                    <div className="flex items-center justify-between w-full mb-2 z-10">
                        <span className="text-sm text-orange-700 font-semibold">Avg Readiness</span>
                        <Brain className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 z-10">{analytics?.overall.averageReadiness || 0}%</div>
                    <p className="text-xs text-slate-500 mt-1 z-10">Career ready</p>
                </div>
                <div className="rounded-2xl border border-orange-200/70 bg-white/70 backdrop-blur-lg p-6 flex flex-col items-start shadow-lg relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-100/60 rounded-full blur-2xl opacity-60" />
                    <div className="flex items-center justify-between w-full mb-2 z-10">
                        <span className="text-sm text-orange-700 font-semibold">Active Sectors</span>
                        <BarChart3 className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 z-10">{analytics?.overall.sectorsActive || 0}</div>
                    <p className="text-xs text-slate-500 mt-1 z-10">Of 3 total</p>
                </div>
            </div>

            {/* Sector Comparison */}
            <div className="p-6 md:p-8 rounded-2xl border border-orange-200/60 bg-white/70 backdrop-blur-xl shadow-xl mb-8">
                <h2 className="text-2xl font-bold mb-6 text-slate-900">Sector Performance Comparison</h2>
                <div className="space-y-6">
                    {/* Healthcare */}
                    {analytics?.bySector.HEALTHCARE && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-healthcare"></div>
                                    <span className="font-medium">Healthcare Informatics</span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {analytics.bySector.HEALTHCARE.overallScore}% Overall
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Career Readiness</div>
                                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-healthcare"
                                            style={{ width: `${analytics.bySector.HEALTHCARE.careerReadiness}%` }}
                                        />
                                    </div>
                                    <div className="text-xs font-medium mt-1">
                                        {analytics.bySector.HEALTHCARE.careerReadiness}%
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Industry Alignment</div>
                                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-healthcare"
                                            style={{ width: `${analytics.bySector.HEALTHCARE.industryAlignment}%` }}
                                        />
                                    </div>
                                    <div className="text-xs font-medium mt-1">
                                        {analytics.bySector.HEALTHCARE.industryAlignment}%
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Overall Score</div>
                                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-healthcare"
                                            style={{ width: `${analytics.bySector.HEALTHCARE.overallScore}%` }}
                                        />
                                    </div>
                                    <div className="text-xs font-medium mt-1">
                                        {analytics.bySector.HEALTHCARE.overallScore}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Agriculture */}
                    {analytics?.bySector.AGRICULTURE && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-agriculture"></div>
                                    <span className="font-medium">Agricultural Technology</span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {analytics.bySector.AGRICULTURE.overallScore}% Overall
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Career Readiness</div>
                                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-agriculture"
                                            style={{ width: `${analytics.bySector.AGRICULTURE.careerReadiness}%` }}
                                        />
                                    </div>
                                    <div className="text-xs font-medium mt-1">
                                        {analytics.bySector.AGRICULTURE.careerReadiness}%
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Industry Alignment</div>
                                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-agriculture"
                                            style={{ width: `${analytics.bySector.AGRICULTURE.industryAlignment}%` }}
                                        />
                                    </div>
                                    <div className="text-xs font-medium mt-1">
                                        {analytics.bySector.AGRICULTURE.industryAlignment}%
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Overall Score</div>
                                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-agriculture"
                                            style={{ width: `${analytics.bySector.AGRICULTURE.overallScore}%` }}
                                        />
                                    </div>
                                    <div className="text-xs font-medium mt-1">
                                        {analytics.bySector.AGRICULTURE.overallScore}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Urban */}
                    {analytics?.bySector.URBAN && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-urban"></div>
                                    <span className="font-medium">Urban & Smart Cities</span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {analytics.bySector.URBAN.overallScore}% Overall
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Career Readiness</div>
                                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-urban"
                                            style={{ width: `${analytics.bySector.URBAN.careerReadiness}%` }}
                                        />
                                    </div>
                                    <div className="text-xs font-medium mt-1">
                                        {analytics.bySector.URBAN.careerReadiness}%
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Industry Alignment</div>
                                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-urban"
                                            style={{ width: `${analytics.bySector.URBAN.industryAlignment}%` }}
                                        />
                                    </div>
                                    <div className="text-xs font-medium mt-1">
                                        {analytics.bySector.URBAN.industryAlignment}%
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">Overall Score</div>
                                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-urban"
                                            style={{ width: `${analytics.bySector.URBAN.overallScore}%` }}
                                        />
                                    </div>
                                    <div className="text-xs font-medium mt-1">
                                        {analytics.bySector.URBAN.overallScore}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Recommendations */}
            <div className="p-6 md:p-8 rounded-2xl border border-orange-200/60 bg-white/70 backdrop-blur-xl shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-slate-900">AI-Powered Recommendations</h2>
                <div className="space-y-4">
                    <div className="p-5 rounded-2xl border border-orange-200/60 bg-white/80 shadow-md flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                            <TrendingUp className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                            <h3 className="font-bold mb-1 text-slate-900">Focus on Urban Development</h3>
                            <p className="text-sm text-slate-600">
                                Your urban sector shows the highest readiness (82%). Consider pursuing advanced smart city certifications to maximize this strength.
                            </p>
                        </div>
                    </div>
                    <div className="p-5 rounded-2xl border border-orange-200/60 bg-white/80 shadow-md flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                            <Target className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                            <h3 className="font-bold mb-1 text-slate-900">Strengthen Agriculture Skills</h3>
                            <p className="text-sm text-slate-600">
                                Add 2-3 more AgriTech projects to boost your innovation readiness score from 68% to 75%+.
                            </p>
                        </div>
                    </div>
                    <div className="p-5 rounded-2xl border border-orange-200/60 bg-white/80 shadow-md flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                            <Award className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                            <h3 className="font-bold mb-1 text-slate-900">Healthcare Certifications</h3>
                            <p className="text-sm text-slate-600">
                                Consider CPHIMS or CAHIMS certification to improve healthcare industry alignment from 72% to 85%+.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
