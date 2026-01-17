"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Target, Award, Brain } from "lucide-react";

interface CrossSectorAnalytics {
    overall: {
        totalSkills: number;
        totalProjects: number;
        totalCertifications: number;
        averageReadiness: number;
        sectorsActive: number;
    };
    bySector: {
        HEALTHCARE?: {
            overallScore: number;
            careerReadiness: number;
            industryAlignment: number;
        };
        AGRICULTURE?: {
            overallScore: number;
            careerReadiness: number;
            industryAlignment: number;
        };
        URBAN?: {
            overallScore: number;
            careerReadiness: number;
            industryAlignment: number;
        };
    };
}

export default function AnalyticsDashboard() {
    const [analytics, setAnalytics] = useState<CrossSectorAnalytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/analytics/cross-sector/overview');
            // const data = await response.json();

            // Mock data
            setAnalytics({
                overall: {
                    totalSkills: 36,
                    totalProjects: 15,
                    totalCertifications: 9,
                    averageReadiness: 75,
                    sectorsActive: 3,
                },
                bySector: {
                    HEALTHCARE: {
                        overallScore: 75,
                        careerReadiness: 78,
                        industryAlignment: 72,
                    },
                    AGRICULTURE: {
                        overallScore: 68,
                        careerReadiness: 70,
                        industryAlignment: 66,
                    },
                    URBAN: {
                        overallScore: 80,
                        careerReadiness: 82,
                        industryAlignment: 78,
                    },
                },
            });
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground">Loading analytics...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Analytics & Insights</h1>
                    <p className="text-muted-foreground">
                        Cross-sector skill intelligence and career readiness
                    </p>
                </div>
            </div>

            {/* Overall Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Total Skills</span>
                        <Target className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-3xl font-bold">{analytics?.overall.totalSkills || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Across all sectors</p>
                </div>

                <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Projects</span>
                        <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-3xl font-bold">{analytics?.overall.totalProjects || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Completed</p>
                </div>

                <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Certifications</span>
                        <Award className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-3xl font-bold">{analytics?.overall.totalCertifications || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Active</p>
                </div>

                <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Avg Readiness</span>
                        <Brain className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-3xl font-bold">{analytics?.overall.averageReadiness || 0}%</div>
                    <p className="text-xs text-muted-foreground mt-1">Career ready</p>
                </div>

                <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Active Sectors</span>
                        <BarChart3 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-3xl font-bold">{analytics?.overall.sectorsActive || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Of 3 total</p>
                </div>
            </div>

            {/* Sector Comparison */}
            <div className="p-6 rounded-xl border border-border bg-card">
                <h2 className="text-xl font-semibold mb-6">Sector Performance Comparison</h2>
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
            <div className="p-6 rounded-xl border border-border bg-card">
                <h2 className="text-xl font-semibold mb-4">AI-Powered Recommendations</h2>
                <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Focus on Urban Development</h3>
                                <p className="text-sm text-muted-foreground">
                                    Your urban sector shows the highest readiness (82%). Consider pursuing advanced smart city certifications to maximize this strength.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-agriculture/5 border border-agriculture/20">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-agriculture/10 flex items-center justify-center flex-shrink-0">
                                <Target className="h-4 w-4 text-agriculture" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Strengthen Agriculture Skills</h3>
                                <p className="text-sm text-muted-foreground">
                                    Add 2-3 more AgriTech projects to boost your innovation readiness score from 68% to 75%+.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-healthcare/5 border border-healthcare/20">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-healthcare/10 flex items-center justify-center flex-shrink-0">
                                <Award className="h-4 w-4 text-healthcare" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Healthcare Certifications</h3>
                                <p className="text-sm text-muted-foreground">
                                    Consider CPHIMS or CAHIMS certification to improve healthcare industry alignment from 72% to 85%+.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
